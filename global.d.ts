type PyoncordObject = Omit<typeof import("./src"), "default"> & {
    unload: () => void;
};

declare global {
    const __PYONCORD_COMMIT_HASH__: string;
    const __PYONCORD_DEV__: boolean;
    const __PYON_MODULE_DEFINITIONS__: { [key: string]: string; };
    const __PYON_MODULE_DEFINITIONS_HASH__: string;

    const nativeModuleProxy: any;

    // These are set by the mod
    const React: typeof import("react");
    const ReactNative: typeof import("react-native");

    const pyoncord: PyoncordObject;
    const pyonRequire: {
        (id: string): number,
        requireAsset: (id: string) => any;
    };
}

export { };
