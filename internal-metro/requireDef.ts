import { findByProps } from "internal-metro";

export default () => ({
    "react": findByProps("createElement"),
    "react-native": findByProps("PlatformColor"),
    "AssetManager": findByProps("getAssetByID"),
    "I18n": findByProps("Messages"),
    "Tables": findByProps("TableRow"),
    "NavigationNative": findByProps("NavigationContainer"),
    "Colors": findByProps("unsafe_rawColors"),
    "Constants": findByProps("NODE_SIZE"),
    "FluxDispatcher": findByProps("dispatch", "subscribe"),
    "TabsNavigationRef": findByProps("getRootNavigationRef"),
    "SettingConstants": findByProps("SETTING_RENDERER_CONFIG")
});
