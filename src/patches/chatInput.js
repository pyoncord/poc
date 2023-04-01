import { waitForModule } from "../metro";

// under patches/external
export default () => {
    waitForModule(
        (m) => m?.name === "ChatInput",
        (exports) => exports.defaultProps.hideGiftButton = true
    );
}
