declare global {
    const __PYONCORD_COMMIT_HASH__: string;
    const __PYONCORD_DEV__: boolean;

    interface Window {
        React: typeof import("react");
        ReactNative: typeof import("react-native");
    }
}

export { }