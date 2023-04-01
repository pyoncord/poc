import { waitForModule } from "../metro";

export default () => {
    waitForModule(
        (m) => m?.name === "ChatInput",
        (exports) => exports.defaultProps.hideGiftButton = true
    );
}
