// https://github.com/vendetta-mod/Vendetta/blob/rewrite/src/ui/assets.ts
import Patcher from "@api/Patcher";
import { AssetManager } from "@metro/common";

const { after } = new Patcher("assets-patcher");

type Asset = Record<string, any> & { id: number; };

export const registeredAssets: Record<string, Asset> = {};

export function patchAssets() {
    const unpatch = after(AssetManager, "registerAsset", ([asset], id: number) => {
        registeredAssets[asset.name] = { ...asset, id: id };
    });

    let asset: Asset, id = 1;
    // eslint-disable-next-line no-cond-assign
    while (asset = AssetManager.getAssetByID(id)) {
        registeredAssets[asset.name] ??= { ...asset, id: id++ };
    }

    return unpatch;
}

export const getAssetByName = (name: string): Asset => registeredAssets[name];
export const getAssetByID = (id: number): Asset => AssetManager.getAssetByID(id);
export const getAssetIDByName = (name: string) => registeredAssets[name]?.id;
