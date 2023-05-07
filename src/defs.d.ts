declare global {
    const __PYONCORD_COMMIT_HASH__: string;
    const __PYONCORD_DEV__: boolean;

    const React: typeof import("react");
    const ReactNative: typeof import("react-native");
}

export { }