/**
 * BSD 3-Clause License
 * Copyright (c) 2023 Team Vendetta
 * -------------------------------------------
 * Original code: https://github.com/vendetta-mod/Vendetta/blob/rewrite/src/lib/utils/findInReactTree.ts
 */

import { FindInTreeOptions, SearchFilter, SearchTree } from "@def";

function treeSearch(tree: SearchTree, filter: SearchFilter, opts: Required<FindInTreeOptions>, depth: number): any {
    if (depth > opts.maxDepth) return;
    if (!tree) return;

    try {
        if (filter(tree)) return tree;
    } catch { }

    if (Array.isArray(tree)) {
        for (const item of tree) {
            if (typeof item !== "object" || item === null) continue;

            try {
                const found = treeSearch(item, filter, opts, depth + 1);
                if (found) return found;
            } catch { }
        }
    } else if (typeof tree === "object") {
        for (const key of Object.keys(tree)) {
            if (typeof tree[key] !== "object" || tree[key] === null) continue;
            if (opts.walkable.length && !opts.walkable.includes(key)) continue;
            if (opts.ignore.includes(key)) continue;

            try {
                const found = treeSearch(tree[key], filter, opts, depth + 1);
                if (found) return found;
            } catch { }
        }
    }
}

export default function findInTree(tree: SearchTree, filter: SearchFilter, opts: FindInTreeOptions = {}): any | undefined {
    return treeSearch(tree, filter, { walkable: [], ignore: [], maxDepth: 100, ...opts }, 0);
}
