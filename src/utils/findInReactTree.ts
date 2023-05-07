import type { SearchFilter, SearchTree } from "@types";
import { findInTree } from "@utils";

export default function findInReactTree(tree: SearchTree, filter: SearchFilter): any {
    return findInTree(tree, filter, {
        walkable: ["props", "children", "child", "sibling"],
    });
}
