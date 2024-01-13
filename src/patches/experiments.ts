import { requireMetroDefaultLazy } from "@metro";
import { FluxDispatcher } from "@metro/common";

const UserStore = requireMetroDefaultLazy("UserStore");
const ExperimentStore = requireMetroDefaultLazy("ExperimentStore");

export default async function patchExperiments() {
    try {
        FluxDispatcher.subscribe("CONNECTION_OPEN", () => {
            UserStore.getCurrentUser().flags |= 1;
            UserStore._dispatcher._actionHandlers
                ._computeOrderedActionHandlers("OVERLAY_INITIALIZE")
                .forEach(({ name, actionHandler }: any) => {
                    name.includes?.("Experiment") && actionHandler?.({
                        serializedExperimentStore: ExperimentStore.getSerializedState(),
                        user: { flags: 1 },
                    });
                });
        });
    } catch (err) {
        console.error("An error occurred while patching experiments", err);
    }
}

