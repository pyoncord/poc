import { findInTree } from ".";

export default function findInReactTree(tree: { [key: string]: any }, filter: any): any {
    return findInTree(tree, filter, {
        walkable: ["props", "children", "child", "sibling"],
    });
}