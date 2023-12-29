import { AssetManager } from "./src/metro/common";

const MMKVManager = globalThis.nativeModuleProxy.MMKVManager as any;
const window = globalThis as typeof globalThis & { [key: string]: any; };

const currentVersion = window.nativeModuleProxy.RTNClientInfoManager.Build;

async function updateItem(name: string, toBe: any) {
    MMKVManager.removeItem(name);
    MMKVManager.setItem(name, JSON.stringify(toBe));
    await MMKVManager.getItem(name);
    return toBe;
}

async function maybeCacheAssets(cache) {
    if (cache && cache.version === currentVersion && cache.assets) return false;

    window.ErrorUtils = void 0;
    const toBeCache = { version: currentVersion, assets: {} };
    AssetManager.registerAsset = asset => {
        toBeCache.assets[asset.name] = asset;
    };

    for (const key in window.modules) {
        try {
            window.__r(key);
        } catch { }
    }

    await updateItem("pyonAssetsCache", toBeCache);
    setImmediate(window.nativeModuleProxy.BundleUpdaterManager.reload);
    return true;
}

async function getAssetsCache() {
    const raw = await MMKVManager.getItem("pyonAssetsCache");
    if (raw == null) return;
    return JSON.parse(raw);
}

export default async () => {
    const cache = window.__pyonAssetsCache = await getAssetsCache();
    return maybeCacheAssets(cache);
};
