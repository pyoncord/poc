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

    const unwaitWrapper = waitForModule(
        (m) => m.default?.name === "UserSettingsOverviewWrapper",
        (exports) => {
            const unpatch = patcher.after(exports, "default", (_args, ret) => {
                const Overview = findInReactTree(ret.props.children, i => i.type && i.type.name === "UserSettingsOverview");

                // Upload logs button gone
                patcher.after(Overview.type.prototype, "renderSupportAndAcknowledgements", (_args, { props: { children } }) => {
                    const index = children.findIndex((c: any) => c?.type?.name === "UploadLogsButton");
                    if (index !== -1) children.splice(index, 1);
                });

                patcher.after(Overview.type.prototype, "render", (_args, { props: { children } }) => {
                    const titles = [I18n.Messages["BILLING_SETTINGS"], I18n.Messages["PREMIUM_SETTINGS"]];

                    //! Fix for Android 174201 and iOS 42188
                    children = findInReactTree(children, (tree) => tree.children[1].type === Forms.FormSection).children;

                    const index = children.findIndex((c: any) => titles.includes(c?.props.label));
                    children.splice(index === -1 ? 4 : index, 0, <SettingsSection />);
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