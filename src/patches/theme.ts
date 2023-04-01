import { waitForModule } from "../metro";
import { getCurrentTheme } from "../themes";
import { createReverseable } from "../utils/createReverseable";

const patchReverse = createReverseable();

export default () => {
    const currentTheme = getCurrentTheme();

    waitForModule(
        (m) => m?.unsafe_rawColors && m.meta,
        (exports) => {
            // TODO: Do something so it unsubscribes on unload
            if (patchReverse.hasReversed) {
                return;
            }

            const orig_rawColors = exports.unsafe_rawColors;
            exports.unsafe_rawColors = {
                ...exports.unsafe_rawColors,
                ...currentTheme.data.rawColors
            };

            const orig = exports.meta.resolveSemanticColor;
            exports.meta.resolveSemanticColor = (theme: string, key: { [key: symbol]: string }) => {
                const realKey = key[orig._sym ??= Object.getOwnPropertySymbols(key)[0]];
                const themeIndex = theme === "dark" ? 0 : theme === "light" ? 1 : 2;

                if (currentTheme.data.semanticColors[realKey]?.[themeIndex]) {
                    return currentTheme.data.semanticColors[realKey][themeIndex];
                }

                return orig(theme, key);
            };

            patchReverse(() => {
                exports.unsafe_rawColors = orig_rawColors;
                exports.meta.resolveSemanticColor = orig;
            });
        }
    );

    return patchReverse;
}