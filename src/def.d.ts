export type SearchTree = Record<string, any>;
export type SearchFilter = (tree: SearchTree) => boolean;
export interface FindInTreeOptions {
    walkable?: string[];
    ignore?: string[];
    maxDepth?: number;
}

type PyoncordObject = Omit<typeof import("."), "default"> & {
    unload: () => void;
};

declare global {
    const __PYONCORD_COMMIT_HASH__: string;
    const __PYONCORD_DEV__: boolean;

    const nativeModuleProxy: any;

    // Set by the mod from entry.ts!
    const React: typeof import("react");
    const ReactNative: typeof import("react-native");

    const pyoncord: PyoncordObject;
}