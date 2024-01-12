// Good luck reading this!
import Patcher from "@api/Patcher";
import { waitForModule } from "@metro";
import { I18n, NavigationNative, TabsNavigationRef } from "@metro/common";
import { lazyNavigate } from "@utils";
import { resolveAssets } from "@utils/assets";

const patcher = new Patcher("settings-patcher");

const icons = resolveAssets({
    Discord: "Discord",
    Wrench: "ic_progress_wrench_24px"
});

// @ts-expect-error
export const sections = window.__pyoncord_sections_patch = {
    [`Pyoncord (${__PYONCORD_COMMIT_HASH__}) ${__PYONCORD_DEV__ ? "(DEV)" : ""}`.trimEnd()]: [
        ["PYONCORD", "Pyoncord", () => import("@ui/screens/General"), icons.Discord],
        ["PYONCORD_PLUGINS", "Plugins", () => import("@ui/screens/Plugins"), icons.Wrench]
    ]
} as {
    [key: string]: [key: string, title: string, getRender: () => Promise<any>, icon: number][];
};

const CustomPageRenderer = React.memo(() => {
    const navigation = NavigationNative.useNavigation();
    const route = NavigationNative.useRoute();

    const { render: PageComponent, ...args } = route.params;

    React.useEffect(() => void navigation.setOptions({ ...args }), []);

    return <PageComponent />;
});

export default function patchSettings() {
    waitForModule("SettingConstants", module => {
        module.SETTING_RENDERER_CONFIG.PYONCORD_CUSTOM_PAGE = {
            type: "route",
            title: () => "Blah?",
            screen: {
                route: "PyoncordCustomPage",
                getComponent: () => CustomPageRenderer
            }
        };

        for (const sect of Object.values(sections)) {
            sect.forEach(([key, title, getRender, icon]) => {
                module.SETTING_RENDERER_CONFIG[key] = {
                    type: "pressable",
                    title: () => title,
                    icon: icon,
                    onPress: () => {
                        const ref = TabsNavigationRef.getRootNavigationRef();
                        lazyNavigate(ref, getRender(), title);
                    },
                    withArrow: true
                };
            });
        }
    });

    waitForModule("modules/main_tabs_v2/native/settings/renderer/SettingListRenderer.tsx", module => {
        patcher.before(module.SearchableSettingsList, "type", ([{ sections: res }]) => {
            if (res.__pyonMarkDirty) return;
            res.__pyonMarkDirty = true;

            let index = -~res.findIndex((i: any) => i.label === I18n.Messages.ACCOUNT_SETTINGS) || 1;
            Object.keys(sections).forEach(sect => {
                res.splice(index++, 0, {
                    label: sect,
                    settings: sections[sect].map(a => a[0])
                });
            });
        });
    });

    return () => patcher.unpatchAllAndStop();
}
