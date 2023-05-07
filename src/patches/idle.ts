import { waitForModule } from "@metro";
import Patcher from "@patcher";

const patcher = new Patcher("idle-patcher");

export default () => {
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
};
