import { waitForModule } from "../metro";
import { createReverseable } from "../utils/createReverseable";

const patcherReverser = createReverseable();

export default () => {
    waitForModule(
        (m) => m?.name === "ChatInput",
        (exports) => {
            exports.defaultProps.hideGiftButton = !patcherReverser.hasReversed;
            patcherReverser(() => exports.defaultProps.hideGiftButton = false);
        }
    );

    return patcherReverser;
}
