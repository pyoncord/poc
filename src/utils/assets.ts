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

export function resolveAsset(asset): number {
    const { path } = asset;
    delete asset.path;

    return AssetManager.registerAsset({
        __packager_asset: true,
        httpServerLocation: path,
        hash: Math.random().toString(),
        type: "png",
        height: 64,
        width: 64,
        scales: [1],
        ...asset
    });
}

// TODO: This may differ between platforms
export function resolveAssets<T>(assets: T) {
    const assetMap = {} as { [Property in keyof T]: number };

    for (const key in assets) {
        assetMap[key] = resolveAsset(assets[key]);
    }

    return assetMap;
}
