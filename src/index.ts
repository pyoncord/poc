import { patchFactories } from "./metro";
import { patchExperiments, patchChatInput, patchTheme, patchIdle } from "./patches";

export default async () => {
    console.log("initalizing usagicord...");
    patchFactories();

    const patches = [
        patchExperiments(),
        patchChatInput(),
        patchTheme(),
        patchIdle()
    ];

    return () => {
        console.log("unloading usagicord...");
        for (const patch of patches) {
            patch?.reverse?.();
        }
    }
}