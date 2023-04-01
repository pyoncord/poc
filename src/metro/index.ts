import EventEmitter from "../EventEmitter";
import { proxyLazy } from "../utils";

declare const modules: Record<string | number, any>;
export const moduleLoadEvent = new EventEmitter();

/**
 * @protected
 * Called during the initialization of a module.
 * Patches the module factory to emit an event when the module is loaded.
 */
export function patchFactories() {
    for (const id in modules) {
        const module = modules[id];

        if (module.factory) {
            /**
             * The factory method contains these args:
             * 0: the globalThis object
             * 1: the metroRequire function (window.__r)
             * 2: the metroImportDefault function (window.__r.metroImportDefault)
             * 3: the metroImportAll function (window.__r.metroImportAll)
             * 4: the exports object
             * 5: the module/return object
             * 6: the module dependencies ids
             * 
             * - It doesn't return any value, but it modifies the module/return object.
             * - Everything is done synchronously.
            */
            // TODO: Is using a Proxy here is a good practice?
            module.factory = new Proxy(module.factory, {
                apply: (target, thisArg, argumentsList) => {
                    target.apply(thisArg, argumentsList);
                    moduleLoadEvent.emit("factory", Number(id));
                    moduleLoadEvent.emit("export", argumentsList[5]);
                }
            });
        }
    }
}

/**
 * Get all the modules that are already initialized.
 * @returns An iterable of the modules
 * @example for (const m of getInititializedModules()) { console.log(m.exports) }
 */
export function* getInitializedModules(): IterableIterator<any> {
    for (const id in modules) {
        if (modules[id].isInitialized) {
            yield modules[id].publicModule;
        }
    }
}

/**
 * Wait for a module to be loaded, then call a callback with the module exports.
 * @param {(m) => boolean} filter 
 * @param {(exports) => void} callback 
 * @returns {void}
*/
export function waitForModule(filter: (m: any) => boolean, callback: (exports: any) => void): void {
    const matches = (exports) => {
        if (exports.default && exports.__esModule && filter(exports.default)) {
            moduleLoadEvent.off("export", matches);
            callback(exports.default);
        }

        if (filter(exports)) {
            moduleLoadEvent.off("export", matches);
            callback(exports);
        }
    }

    moduleLoadEvent.on("export", matches);
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
    return proxyLazy(() => findInitializedModule(filter, returnDefault), {});
}

/**
 * Find an initialized module by its props.
 * @param {string[]} props Props of the module to look for
 * @returns The module's export
 */
export function findByProps(...props: string[]) {
    return findInitializedModule((m) => props.every((prop) => m[prop]));
}

/**
 * Same as findByProps, but lazy.
 */
export function findByPropsLazy(...props: string[]) {
    return proxyLazy(() => findByProps(...props), {});
}

/**
 * Get an already loaded module by its [function] name.
 * @param {string} name The module's name
 * @param {boolean} defaultExport Whether to return the default export or the module itself
 * @returns The function's exports
 */
export function findByName(name: string, defaultExport: boolean = true) {
    return findInitializedModule((m) => m?.name === name, defaultExport);
}

/**
 * Same as findByName, but lazy.
 */
export function findByNameLazy(name: string, defaultExport: boolean = true) {
    return proxyLazy(() => findByName(name, defaultExport), {});
}

/**
 * Find an initialized module (usually class components) by its display name.
 * @param {string} displayName The component's display name
 * @param {boolean} defaultExport Export the default export or the module itself
 * @returns The component's exports
*/
export function findByDisplayName(displayName: string, defaultExport: boolean = true) {
    return findInitializedModule((m) => m?.displayName === displayName, defaultExport);
}

/**
 * Same as findByDisplayName, but lazy.
 */
export function findByDisplayNameLazy(displayName: string, defaultExport = true) {
    return proxyLazy(() => findByDisplayName(displayName, defaultExport), {});
}

/**
 * Synchonously get an already loaded Flux store.\
 * /!\ Only works if the store is already loaded, hence inconsistent.
 * @param {string} storeName The Flux store name
 * @returns The Flux store
*/
export function findByStoreName(storeName: string) {
    return findInitializedModule((m) => m?.getName?.() === storeName);
}

/**
 * Same as findByStoreName, but lazy.
 */
export function findByStoreNameLazy(storeName: string) {
    return proxyLazy(() => findByStoreName(storeName), {});
}