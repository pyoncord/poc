// Generated by dts-bundle-generator v9.2.0

export type PyoncordObject = Omit<typeof import("."), "default"> & {
	unload: () => void;
};
declare global {
	const __PYONCORD_COMMIT_HASH__: string;
	const __PYONCORD_DEV__: boolean;
	const nativeModuleProxy: any;

	const React: typeof import("react");
	const ReactNative: typeof import("react-native");
	const pyoncord: PyoncordObject;
}

export { };
