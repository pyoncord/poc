import { findByProps, waitForModule } from "@metro";

console.log(`Pyon! (Pyoncord, hash=${__PYONCORD_COMMIT_HASH__}, dev=${__PYONCORD_DEV__})`);

try {
    Object.freeze = Object.seal = Object;

    window.pyonRequire = await import("@cacher").then(m => m.default());
    window.React = findByProps("createElement");

    waitForModule("View", m => window.ReactNative = m);

    window.pyoncord = { ...await import("@") };

    pyoncord.unload = await pyoncord.default();

    // Delete the initializer; Pyoncord has already been loaded.
    delete pyoncord.default;
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
