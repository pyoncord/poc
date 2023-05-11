import Patcher from "@api/Patcher";
import { waitForModule } from "@metro";

const patcher = new Patcher("idle-patcher");

export default function patchIdle() {
    const unwait = waitForModule(
        m => m?.dispatch && m._actionHandlers?._orderedActionHandlers,
        exports => {
            patcher.before(exports, "dispatch", args => {
                if (args[0].type === "IDLE") {
                    return [{ type: "THIS_TYPE_DOES_NOT_EXIST" }];
                }
            });
        }
    );

    return () => (unwait(), patcher.unpatchAllAndStop());
}
