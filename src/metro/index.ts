import { proxyLazy } from "@utils";
import { after } from "spitroast";

export * from "internal-metro";

declare const modules: Record<number, any>;

export function requireMetro(name: string) {
    const id = pyonRequire(name);
    if (!id) {
        throw new Error(`No module with name '${name}' was cached`);
    } else if (id === -1) {
        throw new Error(`Module '${name}' was not found during caching`);
    }

    return globalThis.__r(id);
}

export function requireMetroLazy(name: string) {
    return proxyLazy(() => requireMetro(name));
}

export function requireMetroLazyDefault(name: string) {
    return proxyLazy(() => requireMetro(name).default);
}

/**
 * Wait for a module to be loaded, then call a callback with the module exports.
 * @param name name of id (e.g. 'react', 'react-native', 'NavigationNative')
 * @param callback will be called once the module is ready
 * @returns 'unpatch' function that returns a boolean representing success state, otherwise undefined (wait never needed)
 */
export function waitForModule(name: string, callback: (exports: any, module: any, id: number) => void) {
    const id = pyonRequire(name);
    if (!id || id === -1) {
        throw new Error(`Module '${name}' was ${id ? "not found" : "not cached"}`);
    }

    const module = modules[id];
    if (module.isInitialized) {
        callback(module.publicModule.exports, module, id);
        return () => undefined;
    } else {
        const unpatch = after("factory", modules[id], args => {
            callback(args[4].exports, module, id);
        }, true);

        return () => unpatch();
    }
}
