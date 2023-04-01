import { waitForModule, getLoadedStore } from "../metro";
import { awaitUntil } from "../utils";

export default async () => {
    waitForModule(
        (m) => m?.getName?.() === "ExperimentStore",
        async (ExperimentStore) => {
            try {
                const UserStore = getLoadedStore("UserStore");
                await awaitUntil(() => UserStore.getCurrentUser());

                UserStore.getCurrentUser().flags |= 1;
                UserStore._dispatcher._actionHandlers
                    ._computeOrderedActionHandlers("OVERLAY_INITIALIZE")
                    .forEach(({ name, actionHandler }) => {
                        name.includes?.("Experiment") && actionHandler?.({
                            serializedExperimentStore: ExperimentStore.getSerializedState(),
                            user: { flags: 1 },
                        });
                    });
            } catch (err) {
                console.error("An error occurred while patching experiments", err);
            }
        }
    );
}
