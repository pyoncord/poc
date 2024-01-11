import { before, instead } from "spitroast";

const MMKVManager = nativeModuleProxy.MMKVManager as any;
const currentVersion = nativeModuleProxy.RTNClientInfoManager.Build;
const window = globalThis as typeof globalThis & { [key: string]: any; };

async function getItem(key: string) {
    const raw = await MMKVManager.getItem(key);
    if (raw == null) return;
    return JSON.parse(raw);
}

async function updateItemAndRestart(key: string, value: any) {
    MMKVManager.removeItem(key);
    MMKVManager.setItem(key, JSON.stringify(value));
    await MMKVManager.getItem(key);
    window.nativeModuleProxy.BundleUpdaterManager.reload();
}

function getIDByExports(exports: any) {
    for (const key in window.modules) {
        const _exports = window.modules[key]?.publicModule?.exports;
        if (_exports === exports || _exports?.default === exports) {
            return Number(key);
        }
    }

    return -1;
}

async function beginCache() {
    console.log(`Cache invalidated, begining cache for version=${currentVersion}, hash=${__PYON_MODULE_DEFINITIONS_HASH__}`);

    const cache = {
        version: currentVersion,
        hash: __PYON_MODULE_DEFINITIONS_HASH__,
        modules: {},
        assets: {}
    };

    const metro = await import("@metro");
    const { modules } = globalThis as typeof window;

    let _importingModuleId = -1;

    Object.keys(modules).forEach((id: any) => {
        if (modules[id].factory) {
            instead("factory", modules[id], (args, orig) => {
                _importingModuleId = Number(id);
                orig(...args);
                _importingModuleId = -1;
            }, true);
        }
    });

    const AssetManager = metro.findInitializedModule(m => m.registerAsset);
    before("registerAsset", AssetManager, ([asset]) => {
        cache.assets[asset.name] = asset;
    });

    const importTracker = metro.findInitializedModule(m => m.fileFinishedImporting);
    before("fileFinishedImporting", importTracker, ([location]) => {
        if (_importingModuleId === -1) return;
        modules[_importingModuleId].location = location;
    });

    for (const key in window.modules) {
        try {
            window.__r(key);
        } catch (e) {
            // console.log(`Skipping ${key} due to an error while initializing: ${e}`);
        }

        if (window.modules[key]?.location) {
            cache.modules[window.modules[key].location] = Number(key);
        }
    }

    const declaredModules = __PYON_MODULE_DEFINITIONS__;

    for (const key in declaredModules) {
        const exports = Function("metro", "return metro." + declaredModules[key])(metro);
        if (!exports) {
            cache.modules[key] = -1;
            console.warn(`Failed to find ${key} with parameter ${declaredModules[key]}`);
            continue;
        }

        const id = getIDByExports(exports);
        if (id === -1) {
            throw new Error("Could not find ID by exports");
        }

        cache.modules[key] = id;

        if (modules[id].location) {
            cache.modules[modules[id].location] = id;
            console.warn(`Module ${key} (id: ${id}) is locatable with path '${modules[id].location}'`);
        }

    }

    await updateItemAndRestart("pyon-cache", cache);
}

function isCacheInvalidated(cache: any) {
    if (cache.version !== currentVersion) return true;
    if (cache.hash !== __PYON_MODULE_DEFINITIONS_HASH__) return true;
}

export default async () => {
    const cached = await getItem("pyon-cache");

    if (cached && !isCacheInvalidated(cached)) {
        window.pyonRequire = function pyonRequire(id: string) {
            return cached.modules[id];
        };

        return Object.assign(window.pyonRequire, {
            _getCache: () => cached,
            requireAsset: (assetId: string) => {
                return cached.assets[assetId];
            }
        });
    }

    window.ErrorUtils = void 0;
    window.__startDiscord?.();
    await beginCache();
    await new Promise(() => void 0);
};
