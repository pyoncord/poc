import { SettingsAPI } from "@api";
import { connectToDebugger } from "@debug";
import { loadPlugins } from "@managers/plugins";
import { initMetro } from "@metro";
import { patchChatInput, patchExperiments, patchIdle, patchSettings } from "@patches";
import { patchAssets } from "@utils/assets";

export * as api from "@api";
export * as debug from "@debug";
export * as metro from "@metro";
export * as native from "@native";
export * as patches from "@patches";
export * as themes from "@themes";
export * as utils from "@utils";

export const settings = new SettingsAPI("settings.json", {
    experiments: true,
    hideGiftButton: true,
    hideIdling: true
});

export default async () => {
    initMetro();
    connectToDebugger();

    const settingsProxy = (await settings.init()).proxy;

    const patches = [
        patchAssets(),
        settingsProxy.experiments && patchExperiments(),
        settingsProxy.hideGiftButton && patchChatInput(),
        settingsProxy.hideIdling && patchIdle(),
        patchSettings()
    ];

    loadPlugins();

    // @ts-ignore
    window.__startDiscord?.();

    await Promise.all(patches);

    return () => {
        console.log("Unloading Pyoncord...");
        patches.forEach(async p => p && (await p)?.());
    };
};
