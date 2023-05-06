import { findByPropsLazy } from ".";

declare const window: { [key: string]: any };

// NOTE: Always export modules lozily if possible
export const React = window.React ??= findByPropsLazy("createElement");
export const ReactNative = window.ReactNative ??= findByPropsLazy("View");

export const I18n = findByPropsLazy("Messages");
export const Forms = findByPropsLazy("FormSection");
export const AssetManager = findByPropsLazy("registerAsset");
export const NavigationNative = findByPropsLazy("NavigationContainer");