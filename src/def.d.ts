export type SearchTree = Record<string, any>;
export type SearchFilter = (tree: SearchTree) => boolean;
export interface FindInTreeOptions {
    walkable?: string[];
    ignore?: string[];
    maxDepth?: number;
}

type PyoncordObject = typeof import(".") & {
    unload: () => void;
};

declare global {
    const __PYONCORD_COMMIT_HASH__: string;
    const __PYONCORD_DEV__: boolean;

    const React: typeof import("react");
    const ReactNative: typeof import("react-native");

    const pyoncord: PyoncordObject;
}
