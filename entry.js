import { findByProps } from "@metro";

console.log(`Pyon! (Pyoncord, hash=${__PYONCORD_COMMIT_HASH__}, dev=${__PYONCORD_DEV__})`);
const initNow = performance.now();

// Goodbye, frozen objects!
Object.freeze = Object;
Object.seal = Object;

const origObjDefineProperty = Object.defineProperty;
Object.defineProperty = function defineProperty(obj, prop, attr) {
    if (attr.configurable == null && attr.writable == null) {
        attr.configurable = true;
    }
    return origObjDefineProperty.apply(this, arguments);
};

async function init() {
    try {
        await (await import("./caching")).default();

        window.React = findByProps("createElement");
        window.ReactNative = findByProps("View");
        window.pyoncord = { ...await import("@") };

        pyoncord.unload = await pyoncord.default();

        // Delete the initializer; Pyoncord has already been loaded.
        delete pyoncord.default;
        console.log(`Pyoncord initialized in ${performance.now() - initNow}ms`);
    } catch (error) {
        error = error?.stack ?? error;

        alert([
            "Failed to load Pyoncord.\n",
            `Build Hash: ${__PYONCORD_COMMIT_HASH__}`,
            `Debug Build: ${__PYONCORD_DEV__}`,
            `Build Number: ${nativeModuleProxy.RTNClientInfoManager?.Build}`,
            error
        ].join("\n"));

        console.error(error);
    }
}

init();
