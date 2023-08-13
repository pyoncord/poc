import { findByPropsLazy } from "@metro";

// To prevent from getting top-level side effects, always load modules lazily.
export const AssetManager = findByPropsLazy("getAssetByID");
export const I18n = findByPropsLazy("Messages");
export const Forms = findByPropsLazy("FormSection");
export const NavigationNative = findByPropsLazy("NavigationContainer");
export const Styles = findByPropsLazy("createThemedStyleSheet");
export const Colors = findByPropsLazy("unsafe_rawColors");
export const Constants = findByPropsLazy("NODE_SIZE");
export const FluxDispatcher = findByPropsLazy("dispatch", "subscribe");
export const TabsNavigationRef = findByPropsLazy("getRootNavigationRef");
