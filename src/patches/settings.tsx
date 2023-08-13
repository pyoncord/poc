// Good luck reading this!
import Patcher from "@api/Patcher";
import { filters, waitForModule } from "@metro";
import { Forms, I18n, NavigationNative, TabsNavigationRef } from "@metro/common";
import { assets, findInReactTree, lazyNavigate } from "@utils";

const patcher = new Patcher("settings-patcher");

// @ts-expect-error
export const sections = window.__pyoncord_sections_patch = {
    [`Pyoncord (${__PYONCORD_COMMIT_HASH__}) ${__PYONCORD_DEV__ ? "(DEV)" : ""}`.trimEnd()]: [
        ["PYONCORD", "Pyoncord", () => import("@ui/screens/General"), "Discord"],
        ["PYONCORD_PLUGINS", "Plugins", () => import("@ui/screens/Plugins"), "ic_progress_wrench_24px"]
    ]
} as {
    [key: string]: [key: string, title: string, getRender: () => Promise<any>, icon: string][];
};

const CustomPageRenderer = React.memo(() => {
    const navigation = NavigationNative.useNavigation();
    const route = NavigationNative.useRoute();

    const { render: PageComponent, ...args } = route.params;

    React.useEffect(() => void navigation.setOptions({ ...args }), []);

    return <PageComponent />;
});

function SettingsSection() {
    // This has to be destructured here, otherwise it will throw
    const { FormSection, FormRow, FormIcon } = Forms;

    const navigation = NavigationNative.useNavigation();

    return <>
        {Object.keys(sections).map(sect => (
            <FormSection key={sect} title={sect}>
                {sections[sect].map(row => (
                    <FormRow
                        label={row[1]}
                        leading={<FormIcon source={assets.getAssetIDByName(row[3])} />}
                        trailing={FormRow.Arrow}
                        onPress={() => lazyNavigate(navigation, row[2](), row[1])}
                    />
                ))}
            </FormSection>
        ))}
    </>;
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
            const index = children.findIndex((c: any) => c?.type?.name === "UploadLogsButton");
            if (index !== -1) children.splice(index, 1);
        });

        patcher.after(UserSettingsOverview.type.prototype, "render", (_args, res) => {
            const titles = [I18n.Messages.BILLING_SETTINGS, I18n.Messages.PREMIUM_SETTINGS];

            const sections = findInReactTree(
                res.props.children,
                n => n?.children?.[1]?.type === Forms.FormSection
            ).children;

            const index = sections.findIndex((c: any) => titles.includes(c?.props.label));
            sections.splice(-~index || 4, 0, <SettingsSection />);
        });

        unpatch();
    });
}

function patchTabsUI() {
    waitForModule("SETTING_RENDERER_CONFIGS", module => {
        module.SETTING_RENDERER_CONFIGS.PYONCORD_CUSTOM_PAGE = {
            type: "route",
            screen: {
                route: "PyoncordCustomPage",
                getComponent: () => CustomPageRenderer
            }
        };

        for (const sect of Object.values(sections)) {
            sect.forEach(([key, title, getRender, icon]) => {
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
        }

        patcher.after(module, "getSettingTitleConfig", (args, res) => {
            // This will eventually get overriden with navigation.setOptions
            res.PYONCORD_CUSTOM_PAGE = "Pyon!";

            Object.values(sections).forEach(sect => {
                sect.forEach(([key, title]) => res[key] = title);
            });
        });
    });

    waitForModule("useOverviewSettings", module => {
        patcher.after(module, "useOverviewSettings", (args, res) => {
            if (!res || !Array.isArray(res)) return;

            let index = -~res.findIndex((i: any) => i.title === I18n.Messages.ACCOUNT_SETTINGS) || 1;

            Object.keys(sections).forEach(sect => {
                res.splice(index++, 0, {
                    title: sect,
                    settings: sections[sect].map(a => a[0])
                });
            });
        });
    });
}

export default function patchSettings() {
    patchPanelUI();
    patchTabsUI();

    return () => patcher.unpatchAllAndStop();
}
