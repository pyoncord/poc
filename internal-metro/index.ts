// NOTE: This file is import-sensitive, circular dependencies might crash the app!
import { before, instead } from "spitroast";
import proxyLazy from "src/utils/proxyLazy";

declare const modules: Record<number, any>;
export const factoryCallbacks = new Set<(exports: any) => void>();

export let _resolveReady: () => void;
export const onceReady = new Promise(resolve => _resolveReady = <any>resolve);

export type FilterFn = (mod: any) => boolean;

function isInvalidExport(exports: any) {
    return (
        exports == null
        || exports === globalThis
        || typeof exports === "boolean"
        || typeof exports === "number"
        || typeof exports === "string"
        || exports["whar???"] === null
    );
}

function blacklist(id: number) {
    Object.defineProperty(modules, id, {
        value: modules[id],
        enumerable: false,
        configurable: true,
        writable: true
    });
}

export const filters = {
    byProps: (...props: string[]) => (exp: any) => props.length === 1 ? exp[props[0]] != null : props.every(prop => exp?.[prop] != null),
    byName: (name: string, deExp = true) => (exp: any) => (deExp ? exp.name : exp.default?.name) === name,
    byDisplayName: (displayName: string, deExp = true) => (exp: any) => (deExp ? exp.displayName : exp.default?.displayName) === displayName,
    byStoreName: (storeName: string, deExp = true) => (exp: any) => exp._dispatcher && (deExp ? exp : exp.default)?.getName?.() === storeName,
};

// This value is non -1 while a module is being loaded (see below)
let _importingModuleId = -1;

Object.keys(modules).forEach((id: any) => {
    if (modules[id].factory) {
        instead("factory", modules[id], (args, orig) => {
            _importingModuleId = Number(id);
            orig(...args);

            const { 5: exports } = args;
            if (!isInvalidExport(exports)) {
                factoryCallbacks.forEach(cb => cb(exports));
            }

            _importingModuleId = -1;
        }, true);
    }
});

__waitForModule(
    ["fileFinishedImporting"],
    importTracker => {
        before("fileFinishedImporting", importTracker, ([location]) => {
            if (_importingModuleId === -1) return;
            modules[_importingModuleId].location = location;
        });
    }
);

__waitForModule(
    ["dispatch", "_actionHandlers"],
    FluxDispatcher => {
        const cb = () => {
            _resolveReady();
            FluxDispatcher.unsubscribe("CONNECTION_OPEN", cb);
        };
        FluxDispatcher.subscribe("CONNECTION_OPEN", cb);
    }
);

/**
 * Get all the modules that are already initialized.
 * @returns An iterable of the modules
 * @example for (const m of getInititializedModules()) { console.log(m.exports) }
 */
export function* getInitializedModules(): IterableIterator<any> {
    for (const id in modules) {
        if (modules[id].isInitialized) {
            if (isInvalidExport(modules[id].publicModule.exports)) {
                blacklist(id as unknown as number);
                continue;
            }

            yield modules[id].publicModule;
        }
    }
}

/**
 * Wait for a module to be loaded, then call a callback with the module exports.
 * @param {(m) => boolean} filter
 * @param {(exports) => void} callback
*/
function __waitForModule(filter: string | string[] | FilterFn, callback: (exports: any) => void) {
    if (typeof filter !== "function") {
        filter = Array.isArray(filter) ? filters.byProps(...filter) : filters.byProps(filter);
    }

    const find = findInitializedModule(filter as FilterFn);
    if (find) return (callback(find), () => { });

    const matches = (exports: any) => {
        if (exports.default && exports.__esModule && (filter as FilterFn)(exports.default)) {
            factoryCallbacks.delete(matches);
            callback(exports.default);
        }

        if ((filter as FilterFn)(exports)) {
            factoryCallbacks.delete(matches);
            callback(exports);
        }
    };

    factoryCallbacks.add(matches);
    return () => factoryCallbacks.delete(matches);
}

/**
 * Synchronously get an already loaded/initialized module.
 * @param filter A function that returns true if the module is the one we're looking for
 * @param returnDefault Whether to return the default export or the module itself
 * @returns Returns the module exports
 */
export function findInitializedModule(filter: (m: any) => boolean, returnDefault = true): any {
    for (const { exports } of getInitializedModules()) {
        if (exports?.default && exports.__esModule && filter(exports.default)) {
            return returnDefault ? exports.default : exports;
        }
        if (filter(exports)) {
            return exports;
        }
    }
}

/**
 * Same as findInitializedModule, but lazy.
 * @param filter A function that returns true if the module is the one we're looking for
 * @param returnDefault Whether to return the default export or the module itself
 * @returns A proxy that will return the module exports when a property is accessed
 */
export function findLazy(filter: (m: any) => boolean, returnDefault = true): any {
    return proxyLazy(() => findInitializedModule(filter, returnDefault));
}

/**
 * Find an initialized module by its props.
 * @param {string[]} props Props of the module to look for
 * @returns The module's export
 */
export function findByProps(...props: string[]) {
    return findInitializedModule(filters.byProps(...props));
}

/**
 * Same as findByProps, but lazy.
 */
export function findByPropsLazy(...props: string[]) {
    return proxyLazy(() => findByProps(...props));
}

/**
 * Get an already loaded module by its [function] name.
 * @param {string} name The module's name
 * @param {boolean} defaultExport Whether to return the default export or the module itself
 * @returns The function's exports
 */
export function findByName(name: string, defaultExport: boolean = true) {
    return findInitializedModule(filters.byName(name), defaultExport);
}

/**
 * Same as findByName, but lazy.
 */
export function findByNameLazy(name: string, defaultExport: boolean = true) {
    return proxyLazy(() => findByName(name, defaultExport));
}

/**
 * Find an initialized module (usually class components) by its display name.
 * @param {string} displayName The component's display name
 * @param {boolean} defaultExport Export the default export or the module itself
 * @returns The component's exports
*/
export function findByDisplayName(displayName: string, defaultExport: boolean = true) {
    return findInitializedModule(filters.byDisplayName(displayName), defaultExport);
}

/**
 * Same as findByDisplayName, but lazy.
 */
export function findByDisplayNameLazy(displayName: string, defaultExport = true) {
    return proxyLazy(() => findByDisplayName(displayName, defaultExport));
}

/**
 * Synchonously get an already loaded Flux store.\
 * /!\ Only works if the store is already loaded, hence inconsistent.
 * @param {string} storeName The Flux store name
 * @returns The Flux store
*/
export function findByStoreName(storeName: string) {
    return findInitializedModule(filters.byStoreName(storeName));
}

/**
 * Same as findByStoreName, but lazy.
 */
export function findByStoreNameLazy(storeName: string) {
    return proxyLazy(() => findByStoreName(storeName));
}
