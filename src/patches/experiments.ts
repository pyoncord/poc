import { findByStoreNameLazy, onceReady } from "@metro";

const UserStore = findByStoreNameLazy("UserStore");
const ExperimentStore = findByStoreNameLazy("ExperimentStore");

function triggerExperiments() {
    UserStore.getCurrentUser().flags |= 1;
    UserStore._dispatcher._actionHandlers
        ._computeOrderedActionHandlers("OVERLAY_INITIALIZE")
        .forEach(({ name, actionHandler }: any) => {
            name.includes?.("Experiment") && actionHandler?.({
                serializedExperimentStore: ExperimentStore.getSerializedState(),
                user: { flags: 1 },
            });
        });
}

export default async function patchExperiments() {
    try {
        await onceReady;
        for (let i = 0; i < 10; i++) {
            setTimeout(triggerExperiments, 500 * i);
        }
    } catch (err) {
        console.error("An error occurred while patching experiments", err);
    }
}

