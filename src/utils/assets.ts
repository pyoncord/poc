// https://github.com/vendetta-mod/Vendetta/blob/rewrite/src/ui/assets.ts
import Patcher from "@api/Patcher";
import { AssetManager } from "@metro/common";

const patcher = new Patcher("assets-patcher");

type Asset = Record<string, any> & { id: number; };

export const registeredAssets: Record<string, Asset> = {};

export function patchAssets() {
    patcher.instead(AssetManager, "registerAsset", (args, orig) => {
        const [asset] = args;

        if (registeredAssets[asset.name]) {
            Object.assign(registeredAssets[asset.name], asset);
            return registeredAssets[asset.name].id;
        }

        registeredAssets[asset.name] = { ...asset, id: orig(...args) };
        return registeredAssets[asset.name].id;
    });

    let asset: Asset, id = 1;
    // eslint-disable-next-line no-cond-assign
    while (asset = AssetManager.getAssetByID(id)) {
        registeredAssets[asset.name] ??= { ...asset, id: id++ };
    }

    return () => patcher.unpatchAllAndStop();
}


export const getAssetByName = (name: string): Asset => registeredAssets[name];
export const getAssetByID = (id: number): Asset => AssetManager.getAssetByID(id);
export const getAssetIDByName = (name: string) => registeredAssets[name]?.id;

export function requireAssetFromCache(name: string): number {
    const cache = pyonRequire.requireAsset(name);
    return AssetManager.registerAsset(cache);
}

// TODO: This may be different between platforms
export function resolveAssets(assets: Record<string, string>) {
    return new Proxy({}, {
        get: (t, p: string) => t[p] ??= requireAssetFromCache(assets[p])
    }) as { [key: string]: number; };
}
