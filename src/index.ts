import { patchFactories } from "./metro";
import { patchExperiments, patchChatInput, patchTheme, patchIdle, patchSettings } from "./patches";
import { patchAssets } from "./utils/assets";

export default async () => {
    console.log("Initalizing pyoncord...");

    patchFactories();

    const patches = [
        patchAssets(),
        patchExperiments(),
        patchChatInput(),
        // patchTheme(),
        patchIdle(),
        patchSettings()
    ];

    return async () => {
        console.log("Unloading pyoncord...");

        for (const patch of patches) {
            (await patch)?.();
        }
    }
}