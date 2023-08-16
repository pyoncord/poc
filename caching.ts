import { AssetManager } from "./src/metro/common";

const MMKVManager = globalThis.nativeModuleProxy.MMKVManager as any;
const window = globalThis as typeof globalThis & {
    nativeModuleProxy: Record<string, any>;
    [key: string]: any;
};

interface ModuleCache {
    default?: ModuleCache;
    props: string[];
    protoProps: string[];
    classProtoProps: string[];
    compDefaultProps: string[];
    name: string;
    memoName: string;
    forwardRefName: string;
    displayName: string;
    fluxStoreName: string;
    assets: string[];
}

window.ErrorUtils.setGlobalHandler(console.log);
window.ErrorUtils = void 0;

const metroRequire = id => {
    try {
        return window.__r(id);
    } catch {
        return undefined;
    }
};

const currentVersion = window.nativeModuleProxy.RTNClientInfoManager.Build;

const commonName = new Set([
    "__esModule",
    "constructor",
    "default",
    "initialize",
    "$$typeof",
    "compare",
    "type",
    "meta",
    "ddd",
    "assets",
    "layers",
    "markers",
    "displayName",
    "render",
    "defaultProps",
    "_default",
    ...Reflect.ownKeys(() => void 0)
]);

const blacklistedModules = [
    ["heart_eyes", "star_struck", "kissing_heart"],
    ["application/3gpp-ims+xml", "application/a2l"]
];

const __exports = new Set();

function __cache(obj, cache: Partial<ModuleCache>, isDefault = false) {
    if (isDefault) {
        // @ts-ignore
        cache = (cache.default) ??= {} as Partial<ModuleCache>;
    }

    if (__exports.has(obj)) return;
    else __exports.add(obj);

    for (const blacklistedProps of blacklistedModules) {
        if (blacklistedProps.every(p => p in obj)) return;
    }

    cache.props = Object.getOwnPropertyNames(obj);

    if (obj.constructor !== Object && obj.constructor !== Function && obj.__proto__) {
        cache.protoProps = Object.getOwnPropertyNames(obj.__proto__);
    }

    if (typeof obj === "function") {
        if (isNameValid(obj.name)) cache.name = obj.name;
        if (obj.prototype) cache.classProtoProps = Object.getOwnPropertyNames(obj.prototype);
        if (obj.displayName) cache.displayName = obj.displayName;
        if (obj.defaultProps) cache.compDefaultProps = Object.getOwnPropertyNames(obj.defaultProps);
    }

    if (obj.$$typeof) {
        if (obj.type?.name) cache.memoName = obj.type.name;
        if (obj.render?.name) cache.forwardRefName = obj.render.name;
        if (obj.Provider) delete cache.props; // React contexts are mostly unnamed
    }

    if (obj._dispatcher && obj.getName) {
        cache.fluxStoreName = obj.getName();
        delete cache.props; // These props are useless
    }

    if (!isDefault && isValidExports(obj.default) && obj.default !== obj) {
        __cache(obj.default, cache, true);
    }

    for (const key in cache) {
        if (cache[key] instanceof Array) {
            cache[key] = cache[key].filter(isNameValid);
            if (cache[key].length === 0) delete cache[key];
        } else if (typeof cache[key] === "string") {
            if (!isNameValid(cache[key])) {
                delete cache[key];
            }
        }
    }
}

function isNameValid(name: string) {
    return name && name.length > 2 && !commonName.has(name) && isNaN(Number(name));
}

function isValidExports(exp): boolean {
    if (exp == null || exp === window || exp["bye bye proxier"] === null) return false;
    if (typeof exp !== "object" && typeof exp !== "function") return false;

    return true;
}

function isCacheUseful(cache: Partial<ModuleCache>): boolean {
    const isValueMeaningful = val => {
        if (val instanceof Array) return val.filter(s => isValueMeaningful(s)).length > 0;
        if (typeof val === "string") return val.length > 2;
        if (typeof val === "object") return isCacheUseful(val);
    };

    return Object.values(cache).filter(v => isValueMeaningful(v)).length > 0;
}

function createModuleCache(id) {
    const exports = metroRequire(id);
    const cache = {} as Partial<ModuleCache>;

    if (isValidExports(exports)) {
        __cache(exports, cache);
    }

    return isCacheUseful(cache) ? cache : void 0;
}

async function cacheAndRestart() {
    console.log("Cache is unavailable or is outdated, caching and restarting!");

    const c = { version: currentVersion, assets: {} };

    AssetManager.registerAsset = asset => {
        c.assets[asset.name] = asset;
    };

    for (const key in window.modules) {
        const cache = createModuleCache(key);
        if (cache != null) c[key] = cache;
    }

    MMKVManager.removeItem("pyonModuleCache");
    MMKVManager.setItem("pyonModuleCache", JSON.stringify(c));

    // setTimeout or setInterval isn't working!!
    // So, I can't guarantee that our cache is properly set (assuming setItem is actually async)
    setImmediate(window.nativeModuleProxy.BundleUpdaterManager.reload);
}

async function loadCacheOrRestart() {
    const loadedCache = await MMKVManager.getItem("pyonModuleCache");
    if (loadedCache == null) return void cacheAndRestart();

    const parsedCache = JSON.parse(loadedCache);
    if (parsedCache.version !== currentVersion) {
        return void cacheAndRestart();
    }

    delete parsedCache.version;
    return parsedCache;
}

export default () => loadCacheOrRestart().then(cache => {
    window.__pyonModuleCache = cache;

    for (const key in window.modules) if (cache[key]) {
        window.modules[key].__pyonCache = cache[key];
    }

    return cache;
});

