import Patcher from "@api/Patcher";
import { filters, findByPropsLazy, waitForModule } from "@metro";
import { Forms, I18n, NavigationNative, TabsNavigationRef } from "@metro/common";
import { assets, findInReactTree, lazyNavigate } from "@utils";

const patcher = new Patcher("settings-patcher");

const CustomPageRenderer = React.memo(() => {
    const navigation = NavigationNative.useNavigation();
    const route = NavigationNative.useRoute();

    const { render: PageComponent, ...args } = route.params;

    React.useEffect(() => {
        navigation.setOptions({ ...args });
    }, []);

    return <PageComponent />;
});

function SettingsSection() {
    // This has to be destructured here, otherwise it will throw
    const { FormSection, FormRow, FormIcon } = Forms;

    const navigation = NavigationNative.useNavigation();
    const title = `Pyoncord (${__PYONCORD_COMMIT_HASH__}) ${__PYONCORD_DEV__ ? "(DEV)" : ""}`.trimEnd();

    return (
        <FormSection key="Pyoncord" title={title}>
            <FormRow
                label="Pyoncord"
                leading={<FormIcon source={assets.getAssetIDByName("Discord")} />}
                trailing={FormRow.Arrow}
                onPress={() => lazyNavigate(navigation, import("@ui/screens/General"), "Pyoncord")}
            />
            <FormRow
                label="Plugins"
                leading={<FormIcon source={assets.getAssetIDByName("ic_progress_wrench_24px")} />}
                trailing={FormRow.Arrow}
                onPress={() => lazyNavigate(navigation, import("@ui/screens/Plugins"), "Plugins")}
            />
        </FormSection>
    );
}

function patchPanelUI() {
    patcher.patch(filters.byName("getScreens", false)).after("default", (_args, screens) => {
        return Object.assign(screens, {
            PyoncordCustomPage: {
                title: "Pyoncord",
                render: () => <CustomPageRenderer />
            }
        });
    });

    const unpatch = patcher.patch(filters.byName("UserSettingsOverviewWrapper", false)).after("default", (_args, ret) => {
        const UserSettingsOverview = findInReactTree(ret.props.children, n => n.type?.name === "UserSettingsOverview");

        patcher.after(UserSettingsOverview.type.prototype, "renderSupportAndAcknowledgements", (_args, { props: { children } }) => {
            try {
                const index = children.findIndex((c: any) => c?.type?.name === "UploadLogsButton");
                if (index !== -1) children.splice(index, 1);
            } catch {
                // Ignore, this is not a big deal
            }
        });

        patcher.after(UserSettingsOverview.type.prototype, "render", (_args, res) => {
            try {
                const titles = [I18n.Messages.BILLING_SETTINGS, I18n.Messages.PREMIUM_SETTINGS];

                const sections = findInReactTree(
                    res.props.children,
                    n => n?.children?.[1]?.type === Forms.FormSection
                ).children;

                const index = sections.findIndex((c: any) => titles.includes(c?.props.label));
                sections.splice(-~index || 4, 0, <SettingsSection />);
            } catch (e: any) {
                console.error(
                    "An error occurred while trying to append Pyoncord's settings section. " +
                    e?.stack ?? e
                );
            }
        });

        unpatch();
    });
}

function patchTabsUI() {
    const pyonSection = [
        ["PYONCORD", "Pyoncord", () => import("@ui/screens/General"), "Discord"],
        ["PYONCORD_PLUGINS", "Plugins", () => import("@ui/screens/Plugins"), "ic_progress_wrench_24px"]
    ] as [key: string, title: string, getRender: () => Promise<any>, icon: string][];

    waitForModule("SETTING_RENDERER_CONFIGS", module => {
        module.SETTING_RENDERER_CONFIGS.PYONCORD_CUSTOM_PAGE = {
            type: "route",
            screen: {
                route: "PyoncordCustomPage",
                getComponent: () => CustomPageRenderer
            }
        };

        pyonSection.forEach(([key, title, getRender, icon]) => {
            module.SETTING_RELATIONSHIPS[key] = null;
            module.PRESSABLE_SETTINGS_WITH_TRAILING_ARROW?.add(key);

            module.SETTING_RENDERER_CONFIGS[key] = {
                type: "pressable",
                get icon() {
                    return typeof icon === "string"
                        ? assets.getAssetIDByName(icon)
                        : icon;
                },
                onPress: () => {
                    const ref = TabsNavigationRef.getRootNavigationRef();
                    lazyNavigate(ref, getRender(), title);
                }
            };
        });

        patcher.after(module, "getSettingTitleConfig", (args, res) => {
            pyonSection.forEach(([key, title]) => res[key] = title);
            res.PYONCORD_CUSTOM_PAGE = "Pyon!";
        });
    });

    waitForModule("useOverviewSettings", module => {
        patcher.after(module, "useOverviewSettings", (args, res) => {
            if (!(res instanceof Array) || res.find(sect => sect.title === "Pyoncord")) return;

            res.unshift({
                title: "Pyoncord",
                settings: pyonSection.map(a => a[0])
            });
        });
    });
}

export default function patchSettings() {
    patchPanelUI();
    patchTabsUI();

    return () => patcher.unpatchAllAndStop();
}
