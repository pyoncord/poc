import EventEmitter from "../EventEmitter";

// declare const modules: Record<string | number, any>;
export const moduleLoadEvent = new EventEmitter();

/**
 * @protected
 * Called during the initialization of a module.
 * Patches the module factory to emit an event when the module is loaded.
 */
export function patchFactories() {
    for (const id in window.modules) {
        const module = window.modules[id];

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
export function* getInititializedModules() {
    for (const id in window.modules) {
        if (window.modules[id].isInitialized) {
            yield window.modules[id].publicModule;
        }
    }
}

/**
 * Synchonously get an already loaded Flux store.\
 * /!\ Only works if the store is already loaded, hence inconsistent.
 * @param {string} storeName The Flux store name
 * @returns The Flux store
*/
export function getLoadedStore(storeName) {
    for (const { exports } of getInititializedModules()) {
        if (exports?.default?.getName?.() === storeName) {
            return exports.default;
        }
    }
}

/**
 * Wait for a module to be loaded.
 * @param {(m) => boolean} filter 
 * @param {(exports) => void} callback 
 * @returns {void}
 */
export function waitForModule(filter, callback) {
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