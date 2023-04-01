import { findByNameLazy, waitForModule } from "../metro";
import { awaitUntil, createReverseable } from "../utils";

const patcherReverser = createReverseable();
const ChatInput = findByNameLazy("ChatInput");

export default async () => {
    await awaitUntil(() => ChatInput?.defaultProps?.hideGiftButton !== undefined);

    ChatInput.defaultProps.hideGiftButton = !patcherReverser.hasReversed;
    return patcherReverser(() => ChatInput.defaultProps.hideGiftButton = false);
}
