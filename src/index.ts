import StorageWrapper from "@api/StorageWrapper";
import { connectToDebugger } from "@debug";
import { initMetro } from "@metro";
import { patchChatInput, patchExperiments, patchIdle, patchSettings } from "@patches";
import { patchAssets } from "@utils/assets";

export * as api from "@api";
export * as debug from "@debug";
export * as metro from "@metro";
export * as patches from "@patches";
export * as themes from "@themes";
export * as utils from "@utils";

export const settings = new StorageWrapper("settings.json");

export default async () => {
    const settingsProxy = await settings.awaitAndGetProxy();

    initMetro();
    connectToDebugger();

    const patches = [
        patchAssets(),
        settingsProxy.experiments !== false && patchExperiments(),
        settingsProxy.hideGiftButton !== false && patchChatInput(),
        settingsProxy.hideIdling !== false && patchIdle(),
        patchSettings()
    ];

    await Promise.all(patches);

    return () => {
        console.log("Unloading Pyoncord...");
        patches.forEach(async p => p && (await p)?.());
    };
};
