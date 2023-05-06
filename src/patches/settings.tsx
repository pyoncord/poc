import { waitForModule } from "../metro"
import { Forms, I18n, NavigationNative, React } from "../metro/common";
import { findInReactTree, lazyNavigate } from "../utils";
import { getAssetIDByName } from "../utils/assets";

import Patcher from "../patcher"

const patcher = new Patcher("settings-patcher");

function SettingsSection() {
    // This has to be destructured here, otherwise it will throw
    const { FormSection, FormRow, FormIcon } = Forms;

    const navigation = NavigationNative.useNavigation();

    return (
        <FormSection key="Pyoncord" title="Pyoncord">
            <FormRow
                label="General"
                leading={<FormIcon source={getAssetIDByName("ic_settings")} />}
                trailing={FormRow.Arrow}
                onPress={() => lazyNavigate(navigation, import("../ui/screens/General"), "Pyoncord")}
            />
        </FormSection>
    )
}

export default function patchSettings() {
    const unwaitScreens = waitForModule(
        (m) => m.default?.name === "getScreens",
        (exports) => {
            patcher.after(exports, "default", (args, screens) => {
                return Object.assign(screens, {
                    PyoncordCustomPage: {
                        title: "Pyoncord",
                        render: ({ render: PageComponent, ...args }) => {
                            const navigation = NavigationNative.useNavigation();

                            React.useEffect(() => {
                                navigation.setOptions({ ...args });
                            }, []);

                            return <PageComponent />
                        },
                    }
                })
            })
        }
    );

    // https://github.com/vendetta-mod/Vendetta/blob/f66e62d13b4ed7b272d87e8f4519c0ca3a6e34b1/src/ui/settings/index.tsx#
    const unwaitWrapper = waitForModule(
        (m) => m.default?.name === "UserSettingsOverviewWrapper",
        (exports) => {
            const unpatch = patcher.after(exports, "default", (_args, ret) => {
                const UserSettingsOverview = findInReactTree(ret.props.children, (n) => n.type?.name === "UserSettingsOverview");

                patcher.after(UserSettingsOverview.type.prototype, "renderSupportAndAcknowledgements", (_args, { props: { children } }) => {
                    try {
                        const index = children.findIndex((c: any) => c?.type?.name === "UploadLogsButton");
                        if (index !== -1) children.splice(index, 1);
                    } catch {
                        // Ignore, this is not a big deal
                    }
                });

                patcher.after(UserSettingsOverview.type.prototype, "render", (_args, res) => {
                    const titles = [I18n.Messages["BILLING_SETTINGS"], I18n.Messages["PREMIUM_SETTINGS"]];

                    try {
                        const sections = findInReactTree(
                            res.props.children,
                            (n) => n?.children?.[1]?.type === Forms.FormSection
                        ).children;

                        const index = sections.findIndex((c: any) => titles.includes(c?.props.label));
                        sections.splice(-~index || 4, 0, <SettingsSection />);
                    } catch (e) {
                        console.error(
                            "An error occurred while trying to append Pyoncord's settings section. " +
                            e?.stack ?? e
                        );
                    }
                });

                unpatch();
            });
        }
    );

    return () => {
        unwaitScreens();
        unwaitWrapper();
        patcher.unpatchAllAndStop();
    }
}