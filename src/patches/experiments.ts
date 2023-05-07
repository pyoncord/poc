import { findByStoreNameLazy } from "@metro";
import { awaitUntil } from "@utils";

const UserStore = findByStoreNameLazy("UserStore");
const ExperimentStore = findByStoreNameLazy("ExperimentStore");

export default async () => {
    try {
        // Wait for UserStore to be initialized and user to be logged in
        await awaitUntil(() => UserStore.getCurrentUser?.());

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
};
