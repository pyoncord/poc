import { before, instead } from "spitroast";

import { findInitializedModule } from ".";
import getRequireDefinition from "./requireDef";

const MMKVManager = nativeModuleProxy.MMKVManager as any;
const currentVersion = nativeModuleProxy.RTNClientInfoManager.Build;
const window = globalThis as typeof globalThis & { [key: string]: any; };

async function getItem() {
    const raw = await MMKVManager.getItem("pyon-cache");
    if (raw == null) return;
    return JSON.parse(raw);
}

async function updateItemAndRestart(value: any, key = "pyon-cache") {
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
        stats: {
            skippedModuleIds: new Array<number>,
            logs: new Array<string>
        },
        modules: {},
        assets: {}
    };

    const log = (w: string) => (console.log(w), cache.stats.logs.push(w), void 0);

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

    const AssetManager = findInitializedModule(m => m.registerAsset);
    before("registerAsset", AssetManager, ([asset]) => {
        cache.assets[asset.name] = asset;
    });

    // importTracker exists once index.bundle.tsx is loaded
    const importTracker = findInitializedModule(m => m.fileFinishedImporting);
    before("fileFinishedImporting", importTracker, ([location]) => {
        if (_importingModuleId === -1) return;
        modules[_importingModuleId].location = location;
    });

    for (const key in window.modules) {
        const exports = (() => {
            try {
                return window.__r(key);
            } catch (e) {
                // log(`Skipping ${key} due to an error while initializing: ${e}`);
                cache.stats.skippedModuleIds.push(Number(key));
            }
        })();

        // Cache stores
        if (exports?.default && exports.default._dispatcher && typeof exports.default.getName === "function") {
            cache.modules[exports.default.getName()] = Number(key);
        }

        // Cache locations
        if (window.modules[key]?.location) {
            cache.modules[window.modules[key].location] = Number(key);
        }
    }

    const requireDefinition = getRequireDefinition();

    for (const key in requireDefinition) {
        if (cache.modules[key] != null) {
            log(`Manual require definition of ('${key}') conflicts with internal cacher ('${key}'), skipping..`);
            continue;
        }

        const exports = requireDefinition[key];
        if (!exports) {
            cache.modules[key] = -1;
            log(`Failed to execute find of '${key}'`);
            continue;
        }

        const id = getIDByExports(exports);
        if (id === -1) {
            throw new Error("Unexpected getIDByExports return");
        }

        cache.modules[key] = id;

        if (modules[id].location) {
            cache.modules[modules[id].location] = id;
            log(`Module '${key}' (${id}) can be located with path '${modules[id].location}'`);
        }
    }

    await updateItemAndRestart(cache);
}

function isCacheInvalidated(cache: any) {
    if (cache.version !== currentVersion) return true;
    if (cache.hash !== __PYON_MODULE_DEFINITIONS_HASH__) return true;
}

export default async () => {
    const cached = await getItem();

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
    await beginCache().then(console.error);
    await new Promise(() => void 0);
};
