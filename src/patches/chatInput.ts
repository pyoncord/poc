import { findByNameLazy, waitForModule } from "../metro";
import { awaitUntil } from "../utils";

import Patcher from "../patcher";

const ChatInput = findByNameLazy("ChatInput");

export default async () => {
    await awaitUntil(() => ChatInput?.defaultProps?.hideGiftButton !== undefined);

    ChatInput.defaultProps.hideGiftButton = false;
    return () => ChatInput.defaultProps.hideGiftButton = true;
}
