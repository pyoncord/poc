import { findByProps } from "./src/metro";

async function init() {
    try {
        globalThis.React = findByProps("createElement");
        globalThis.ReactNative = findByProps("View");

        await import("./src").then(({ default: d }) => d());
    } catch (error) {
        error = error?.stack ?? error;
        alert("Failed to load Pyoncord.\n" + error);
        console.error(error);
    }
}

init();