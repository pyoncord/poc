type PyoncordObject = Omit<typeof import("."), "default"> & {
    unload: () => void;
};

declare global {
    const __PYONCORD_COMMIT_HASH__: string;
    const __PYONCORD_DEV__: boolean;

    const nativeModuleProxy: any;

    // These are set by the mod
    const React: typeof import("react");
    const ReactNative: typeof import("react-native");

    const pyoncord: PyoncordObject;
}

export { };
