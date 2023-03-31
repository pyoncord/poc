import EventEmitter from "./EventEmitter";
import { getCurrentTheme } from "./themes";

export default async () => {
    patchFactories();

    patchChatInput();
    patchJSTheme();
    patchExperiments();
}

// Get all already initialized modules
function* getInititializedModules() {
    for (const id in window.modules) {
        if (window.modules[id].isInitialized) {
            yield window.modules[id].publicModule;
        }
    }
}

const moduleLoadEvent = new EventEmitter();

function patchFactories() {
    for (const id in window.modules) {
        const module = window.modules[id];

        /**
         * The factory method contains these args:
         * 0: the globalThis object
         * 1: the metroRequire function (window.__r)
         * 2: the metroImportDefault function (window.__r.metroImportDefault)
         * 3: the metroImportAll function (window.__r.metroImportAll)
         * 4: the exports object
         * 5: the module/return object
         * 6: the module dependencies ids
         * 
         * - It doesn't return any value, but it modifies the module/return object.
         * - Everything is done synchronously.
         */
        if (module.factory) {
            // TODO: Will using a Proxy here is a good practice?
            module.factory = new Proxy(module.factory, {
                apply: (target, thisArg, argumentsList) => {
                    target.apply(thisArg, argumentsList);
                    moduleLoadEvent.emit("export", argumentsList[5]);
                }
            });
        }
    }
}

const waitFor = (condition) => new Promise((resolve) => {
    const interval = setInterval(() => {
        if (condition()) {
            clearInterval(interval);
            resolve();
        }
    }, 100);
});

function waitForModule(filter, callback) {
    const matches = (exports) => {
        if (exports.default && exports.__esModule && filter(exports.default)) {
            moduleLoadEvent.off("export", matches);
            callback(exports.default);
        }

        if (filter(exports)) {
            moduleLoadEvent.off("export", matches);
            callback(exports);
        }
    }

    moduleLoadEvent.on("export", matches);
}

function getLoadedStore(storeName) {
    for (const { exports } of getInititializedModules()) {
        if (exports?.default?.getName?.() === storeName) {
            return exports.default;
        }
    }
}

async function patchExperiments() {
    waitForModule(
        (m) => m?.getName?.() === "UserStore",
        async (exports) => {
            const UserStore = exports;

            await waitFor(() => UserStore.getCurrentUser());
            const ExperimentStore = getLoadedStore("ExperimentStore");

            UserStore.getCurrentUser().flags += 1;

            const actionHandlers = UserStore._dispatcher._actionHandlers._computeOrderedActionHandlers("OVERLAY_INITIALIZE").filter(e => e.name.includes("Experiment"));

            for (let a of actionHandlers) {
                a.actionHandler({
                    serializedExperimentStore: ExperimentStore.getSerializedState(),
                    user: { flags: 1 },
                });
            }

            ExperimentStore.storeDidChange();
            UserStore.getCurrentUser().flags -= 1;
        }
    );
}

function patchChatInput() {
    waitForModule(
        (m) => m?.name === "ChatInput",
        (exports) => exports.defaultProps.hideGiftButton = true
    );
}

const currentTheme = getCurrentTheme();
function patchJSTheme() {
    waitForModule(
        (m) => m?.unsafe_rawColors && m.meta,
        (exports) => {
            exports.unsafe_rawColors = {
                ...exports.unsafe_rawColors,
                ...currentTheme.data.rawColors
            };

            const orig = exports.meta.resolveSemanticColor;
            exports.meta.resolveSemanticColor = (theme, key) => {
                const realKey = key[orig._sym ??= Object.getOwnPropertySymbols(key)[0]];
                const themeIndex = theme === "dark" ? 0 : theme === "light" ? 1 : 2;

                if (currentTheme.data.semanticColors[realKey]?.[themeIndex]) {
                    return currentTheme.data.semanticColors[realKey][themeIndex];
                }

                return orig(theme, key);
            };
        }
    );
}