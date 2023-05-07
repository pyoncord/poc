import { findByProps } from "@metro";

console.log("Hello from Pyoncord!");

async function init() {
    try {
        globalThis.React = findByProps("createElement");
        globalThis.ReactNative = findByProps("View");

        await import("@").then(({ default: d }) => d());
    } catch (error) {
        error = error?.stack ?? error;
        alert("Failed to load Pyoncord.\n" + error);
        console.error(error);
    }
}

init();
