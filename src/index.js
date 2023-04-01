import { patchFactories } from "./metro";
import { patchExperiments, patchChatInput, patchTheme, patchIdle } from "./patches";

export default async () => {
    patchFactories();

    patchExperiments();
    patchChatInput();
    patchTheme();
    patchIdle();
}