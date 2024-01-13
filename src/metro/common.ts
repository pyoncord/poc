import { requireMetroDefaultLazy, requireMetroLazy } from "@metro";

// To prevent from getting top-level side effects, always load modules lazily.
export const AssetManager = requireMetroLazy("AssetManager");
export const I18n = requireMetroDefaultLazy("I18n");
export const Forms = requireMetroLazy("uikit-native/refresh/form/index.tsx");
export const Tables = requireMetroLazy("Tables");
export const NavigationNative = requireMetroLazy("NavigationNative");
export const Colors = requireMetroDefaultLazy("Colors");
export const Constants = requireMetroLazy("Constants");
export const FluxDispatcher = requireMetroDefaultLazy("FluxDispatcher");
export const TabsNavigationRef = requireMetroLazy("TabsNavigationRef");
