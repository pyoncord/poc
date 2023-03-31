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

for (const { exports } of getInititializedModules()) {
    if (exports?.__esModule && typeof exports.default === "function" && exports.default.name === "EventEmitter") {
        window.EventEmitter = exports.default;
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

function getLoadedStore(storeName) {
    for (const { exports } of getInititializedModules()) {
        if (exports?.default?.getName?.() === storeName) {
            return exports.default;
        }
    }
}

async function patchExperiments() {
    moduleLoadEvent.addListener("export", async (exports) => {
        if (exports?.default?.getName?.() !== "UserStore") return;

        const UserStore = exports?.default;

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
    });
}

function patchChatInput() {
    moduleLoadEvent.addListener("export", (exports) => {
        if (exports?.default?.name === "ChatInput") {
            exports.default.defaultProps.hideGiftButton = true;
        }
    });
}

function patchJSTheme() {
    // hardcoded from https://github.com/Fierdetta/themes/blob/main/monokai-night.json :)
    const customTheme = {
        "name": "Monokai Night",
        "description": "A dark and minimalistic theme based on the Monokai-inspired Visual Studio Code theme, Monokai Night.",
        "authors": [
            {
                "name": "Fiery",
                "id": "890228870559698955"
            }
        ],
        "semanticColors": {
            "CHAT_BACKGROUND": ["#1f1f1f"],
            "BACKGROUND_PRIMARY": ["#1f1f1f"],
            "BACKGROUND_SECONDARY": ["#161616"],
            "BACKGROUND_SECONDARY_ALT": ["#262626"],
            "BACKGROUND_TERTIARY": ["#0f0f0f"],
            "BACKGROUND_FLOATING": ["#0f0f0f"],
            "BACKGROUND_MOBILE_PRIMARY": ["#1f1f1f"],
            "BACKGROUND_MOBILE_SECONDARY": ["#161616"],
            "BACKGROUND_NESTED_FLOATING": ["#161616"],
            "BACKGROUND_MODIFIER_SELECTED": ["#262626"],
            "BACKGROUND_MENTIONED": ["#f9267210"],
            "BACKGROUND_MESSAGE_HIGHLIGHT": ["#66d9ef10"],
            "HEADER_PRIMARY": ["#f2f2f2"],
            "HEADER_SECONDARY": ["#dddddd"],
            "TEXT_NORMAL": ["#f2f2f2"],
            "TEXT_LINK": ["#56adbc"],
            "TEXT_BRAND": ["#f92672"],
            "CONTROL_BRAND_FOREGROUND": ["#f92672"],
            "CHANNEL_ICON": ["#666666"],
            "CHANNELS_DEFAULT": ["#666666"],
            "INTERACTIVE_NORMAL": ["#666666"],
            "INTERACTIVE_ACTIVE": ["#f2f2f2"]
        },
        "rawColors": {
            "PRIMARY_600": "#1f1f1f",
            "PRIMARY_500": "#363636",
            "BRAND_100": "#fff6f9",
            "BRAND_130": "#fee5ee",
            "BRAND_160": "#fedce8",
            "BRAND_200": "#fed4e3",
            "BRAND_230": "#fdc2d8",
            "BRAND_260": "#fdb1cc",
            "BRAND_300": "#fca0c1",
            "BRAND_330": "#fc8eb6",
            "BRAND_345": "#fb7daa",
            "BRAND_360": "#fb6b9f",
            "BRAND_400": "#fa5a94",
            "BRAND_430": "#fa4989",
            "BRAND_460": "#f9377d",
            "BRAND_500": "#f92672",
            "BRAND_530": "#e52369",
            "BRAND_560": "#d12060",
            "BRAND_600": "#bd1d57",
            "BRAND_630": "#a91a4e",
            "BRAND_660": "#951744",
            "BRAND_700": "#81143b",
            "BRAND_730": "#6e1132",
            "BRAND_760": "#5a0e29",
            "BRAND_800": "#460b20",
            "BRAND_830": "#320817",
            "BRAND_860": "#1e050e",
            "BRAND_900": "#0a0205",
            "YELLOW_300": "#f92672",
            "RED_400": "#f92672",
            "GREEN_360": "#86b42b"
        },
        "spec": 2
    };

    moduleLoadEvent.addListener("export", (exports) => {
        if (typeof exports.default?.unsafe_rawColors === "object" && exports.default.meta) {
            exports.default.unsafe_rawColors = {
                ...exports.default.unsafe_rawColors,
                ...customTheme.rawColors
            };

            const orig = exports.default.meta.resolveSemanticColor;
            exports.default.meta.resolveSemanticColor = (theme, key) => {
                const realKey = key[orig._sym ??= Object.getOwnPropertySymbols(key)[0]];
                const themeIndex = theme === "dark" ? 0 : theme === "light" ? 1 : 2;


                if (customTheme.semanticColors[realKey]?.[themeIndex]) {
                    return customTheme.semanticColors[realKey][themeIndex];
                }

                return orig(theme, key);
            };
        }
    });
}