import { waitForModule } from "../metro";

import Patcher from "../patcher";

const patcher = new Patcher("idle-patcher");

export default () => {
    waitForModule(
        (m) => m?.dispatch && m._actionHandlers?._orderedActionHandlers,
        (exports) => {
            patcher.before(exports, "dispatch", (args) => {
                if (args[0].type === "IDLE") {
                    args[0] = { type: "THIS_TYPE_DOES_NOT_EXIST" }
                }
            })
        }
    );
}