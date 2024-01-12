import { onceReady, requireMetroLazyDefault } from "@metro";

const UserStore = requireMetroLazyDefault("UserStore");
const ExperimentStore = requireMetroLazyDefault("ExperimentStore");

export default async function patchExperiments() {
    try {
        await onceReady;

        UserStore.getCurrentUser().flags |= 1;
        UserStore._dispatcher._actionHandlers
            ._computeOrderedActionHandlers("OVERLAY_INITIALIZE")
            .forEach(({ name, actionHandler }: any) => {
                name.includes?.("Experiment") && actionHandler?.({
                    serializedExperimentStore: ExperimentStore.getSerializedState(),
                    user: { flags: 1 },
                });
            });
    } catch (err) {
        console.error("An error occurred while patching experiments", err);
    }
}

