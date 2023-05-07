import { patchFactories } from "@metro";
import { patchChatInput, patchExperiments, patchIdle, patchSettings } from "@patches";
import { assets } from "@utils";

export default async () => {
    console.log("Initializing Pyoncord...");

    patchFactories();

    const patches = [
        assets.patchAssets(),
        patchExperiments(),
        patchChatInput(),
        // patchTheme(),
        patchIdle(),
        patchSettings()
    ];

    return async () => {
        console.log("Unloading Pyoncord...");

        for (const patch of patches) {
            (await patch)?.();
        }
    };
};
