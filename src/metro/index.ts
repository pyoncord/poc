// NOTE: This file is import-sensitive, circular dependencies might crash the app!
import EventEmitter from "@utils/EventEmitter";
import proxyLazy from "@utils/proxyLazy";
import { after, instead } from "spitroast";

export * as common from "@metro/common";

declare const modules: Record<number, any>;
export const factoryCallbacks = new Set<(exports: any) => void>();

let _isReady = false;
let _resolveReady: () => void;
export const ready = new Promise<void>(resolve => _resolveReady = resolve);

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

/**
 * @private
 * Called during the initialization of a module.
 * Patches the module factory to emit an event when the module is loaded.
 */
export function initMetro() {
    for (const id in modules) {
        const module = modules[id];

        if (module.factory) {
            /**
             * The factory method contains these args:
             * 0: the global object
             * 1: the metroRequire function (window.__r)
             * 2: the metroImportDefault function (window.__r.metroImportDefault)
             * 3: the metroImportAll function (window.__r.metroImportAll)
             * 4: the exports object
             * 5: the module/return object
             * 6: the module dependencies ids (array)
             *
             * - It doesn't return any value, but it modifies the module/return object.
             * - Everything is done synchronously.
            */

            after("factory", module, ({ 5: exports }) => {
                if (isInvalidExport(exports)) return;
                factoryCallbacks.forEach(cb => cb(exports));
            }, true);
        }
    }

    waitForModule(
        m => m?.dispatch && m._actionHandlers?._orderedActionHandlers,
        FluxDispatcher => {
            FluxDispatcher.subscribe("CONNECTION_OPEN", () => {
                if (!_isReady) {
                    _resolveReady();
                    _isReady = true;
                }
            });
        }
    );
}

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
export function waitForModule(filter: (m: any) => boolean, callback: (exports: any) => void) {
    const matches = (exports: any) => {
        if (exports.default && exports.__esModule && filter(exports.default)) {
            factoryCallbacks.delete(matches);
            callback(exports.default);
        }

        if (filter(exports)) {
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
    return findInitializedModule(m => props.every(prop => m?.[prop]));
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
    return findInitializedModule(m => m?.name === name, defaultExport);
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
    return findInitializedModule(m => m?.displayName === displayName, defaultExport);
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
    return findInitializedModule(m => m?.getName?.() === storeName);
}

/**
 * Same as findByStoreName, but lazy.
 */
export function findByStoreNameLazy(storeName: string) {
    return proxyLazy(() => findByStoreName(storeName));
}
