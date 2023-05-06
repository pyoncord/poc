import { patchFactories } from "./metro";
import { patchExperiments, patchChatInput, patchTheme, patchIdle } from "./patches";

export default async () => {
    console.log("Initalizing pyoncord...");

    patchFactories();

    const patches = [
        patchExperiments(),
        patchChatInput(),
        patchTheme(),
        patchIdle()
    ] as (void | any | Promise<any>)[];

    return async () => {
        console.log("Unloading pyoncord...");
        for (const patch of patches) {
            if (patch instanceof Promise) {
                (await patch)?.reverse?.();
            } else {
                patch?.reverse?.();
            }
        }
    }
}