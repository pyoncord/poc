import { patchFactories } from "@metro";
import { patchChatInput, patchExperiments, patchIdle, patchSettings } from "@patches";
import { patchAssets } from "@utils/assets";

export * as metro from "@metro";
export * as patches from "@patches";
export * as themes from "@themes";
export * as utils from "@utils";

export default async () => {
    console.log(`Initializing Pyoncord (hash=${__PYONCORD_COMMIT_HASH__} dev=${__PYONCORD_DEV__})`);
    patchFactories();

    const patches = [
        patchAssets(),
        patchExperiments(),
        patchChatInput(),
        patchIdle(),
        patchSettings()
    ];

    await Promise.all(patches);

    return () => {
        console.log("Unloading Pyoncord...");
        patches.forEach(async p => (await p)?.());
    };
};
