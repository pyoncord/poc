import { waitForModule } from "../metro";

export default async () => {
    let hideGiftButton, moduleExports;

    const unwait = waitForModule(
        (m) => typeof m?.defaultProps?.hideGiftButton === "boolean",
        (exports) => {
            moduleExports = exports;
            hideGiftButton = exports.defaultProps.hideGiftButton;

            exports.defaultProps.hideGiftButton = true;
        }
    )

    return () => hideGiftButton !== undefined
        ? moduleExports.defaultProps.hideGiftButton = hideGiftButton
        : unwait();
}
