import Patcher from "@api/Patcher";
import { onceReady } from "@metro";
import { FluxDispatcher } from "@metro/common";

const patcher = new Patcher("idle-patcher");

export default async function patchIdle() {
    await onceReady;

    console.log(FluxDispatcher.dispatch);
    patcher.before(FluxDispatcher, "dispatch", args => {
        if (args[0].type === "IDLE") {
            return [{ type: "THIS_TYPE_DOES_NOT_EXIST" }];
        }
    });

    return patcher.unpatchAllAndStop;
}
