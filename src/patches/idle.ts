import { waitForModule } from "../metro";

export default () => {
    waitForModule(
        (m) => m?.dispatch && m._actionHandlers?._orderedActionHandlers,
        (exports) => {
            // Cancel IDLE dispatches
            exports.dispatch = new Proxy(exports.dispatch, {
                apply: (target, thisArg, argumentsList) => {
                    if (argumentsList[0].type === "IDLE") {
                        return;
                    }

                    return target.apply(thisArg, argumentsList);
                }
            });
        }
    );
}