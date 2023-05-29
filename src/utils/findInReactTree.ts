import { findInTree } from "@utils";

import { SearchFilter, SearchTree } from "./findInTree";

export default function findInReactTree(tree: SearchTree, filter: SearchFilter): any {
    return findInTree(tree, filter, {
        walkable: ["props", "children", "child", "sibling"],
    });
}
