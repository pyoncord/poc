
function treeSearch(tree: any, filter: any, opts: Required<any>, depth: number): any {
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

export default function findInTree(tree: any, filter: any, opts: any = {}): any | undefined {
    return treeSearch(tree, filter, { walkable: [], ignore: [], maxDepth: 100, ...opts }, 0);
}