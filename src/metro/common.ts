import { requireMetroLazy } from "@metro";

// To prevent from getting top-level side effects, always load modules lazily.
export const AssetManager = requireMetroLazy("AssetManager");
export const I18n = requireMetroLazy("I18n").default;
export const Forms = requireMetroLazy("uikit-native/refresh/form/index.tsx");
export const Tables = requireMetroLazy("Tables");
export const NavigationNative = requireMetroLazy("NavigationNative");
export const Colors = requireMetroLazy("Colors").default;
export const Constants = requireMetroLazy("Constants");
export const FluxDispatcher = requireMetroLazy("FluxDispatcher").default;
export const TabsNavigationRef = requireMetroLazy("TabsNavigationRef");
