import { findInTree } from ".";

export default (tree: { [key: string]: any }, filter: any): any => findInTree(tree, filter, {
    walkable: ["props", "children", "child", "sibling"],
});