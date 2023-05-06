// https://github.com/vendetta-mod/Vendetta/blob/rewrite/src/ui/assets.ts
import { AssetManager } from "../metro/common";
import Patcher from "../patcher";

const { after } = new Patcher("assets-patcher");

type Asset = Record<string, any> & { id: number };

export const all: Record<string, Asset> = {};

export function patchAssets() {
    const unpatch = after(AssetManager, "registerAsset", (args: Asset[], id: number) => {
        const asset = args[0];
        all[asset.name] = { ...asset, id: id };
    });

    for (let id = 1; ; id++) {
        const asset = AssetManager.getAssetByID(id);
        if (!asset) break;
        if (all[asset.name]) continue;
        all[asset.name] = { ...asset, id: id };
    };

    return unpatch;
}

export const find = (filter: (a: any) => void): Asset | null | undefined => Object.values(all).find(filter);
export const getAssetByName = (name: string): Asset => all[name];
export const getAssetByID = (id: number): Asset => AssetManager.getAssetByID(id);
export const getAssetIDByName = (name: string) => all[name]?.id;