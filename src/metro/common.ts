import { findByProps, findByPropsLazy } from "@metro";

export const AssetManager = findByProps("getAssetByID");

// NOTE: Modules that are lazy loaded (not initialized early) has to be lazy
export const I18n = findByPropsLazy("Messages");
export const Forms = findByPropsLazy("FormSection");
export const NavigationNative = findByPropsLazy("NavigationContainer");
