// https://github.com/vendetta-mod/Vendetta/blob/rewrite/src/ui/assets.ts
import Patcher from "@api/Patcher";
import { AssetManager } from "@metro/common";

const patcher = new Patcher("assets-patcher");

type Asset = Record<string, any> & { id: number; };

// @ts-ignore
export const registeredAssets: Record<string, Asset> = window.__pyonAssetsCache?.assets ?? {};
export const assetNameToId: Record<string, number> = {};

export const getAssetByName = (name: string): Asset => registeredAssets[name];
export const getAssetByID = (id: number): Asset => AssetManager.getAssetByID(id);
export const getAssetIDByName = (name: string) => {
    return assetNameToId[name] ??= AssetManager.registerAsset(registeredAssets[name]);
};

export function resolveAssets<T extends Record<string, any>>(map: T) {
    const ret = {} as Record<keyof T, number>;
    for (const key in map) {
        ret[key] = getAssetIDByName(map[key]);
    }

    return ret;
}
