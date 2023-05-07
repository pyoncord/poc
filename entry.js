import { findByProps } from "@metro";

console.log("Hello from Pyoncord!");

async function init() {
    try {
        globalThis.React = findByProps("createElement");
        globalThis.ReactNative = findByProps("View");

        const pyoncord = await import("@");
        const unload = await pyoncord.default();

        globalThis.pyoncord = {
            ...pyoncord,
            default: void 0,
            unload
        };

    } catch (error) {
        error = error?.stack ?? error;
        alert("Failed to load Pyoncord.\n" + error);
        console.error(error);
    }

    console.log(globalThis.pyoncord);
}

init();
