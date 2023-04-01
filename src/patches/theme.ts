import { waitForModule } from "../metro";
import { getCurrentTheme } from "../themes";
import { createReverseable } from "../utils";

const patchReverse = createReverseable();

export default async () => {
    const currentTheme = getCurrentTheme();

    waitForModule(
        (m) => m?.unsafe_rawColors && m.meta,
        (ColorModule) => {
            // TODO: Do something so it unsubscribes on unload
            if (patchReverse.hasReversed) {
                return;
            }

            const orig_rawColors = ColorModule.unsafe_rawColors;
            ColorModule.unsafe_rawColors = {
                ...ColorModule.unsafe_rawColors,
                ...currentTheme.data.rawColors
            };

            const orig = ColorModule.meta.resolveSemanticColor;
            ColorModule.meta.resolveSemanticColor = (theme: string, key: { [key: symbol]: string }) => {
                const realKey = key[orig._sym ??= Object.getOwnPropertySymbols(key)[0]];
                const themeIndex = theme === "dark" ? 0 : theme === "light" ? 1 : 2;

                if (currentTheme.data.semanticColors[realKey]?.[themeIndex]) {
                    return currentTheme.data.semanticColors[realKey][themeIndex];
                }

                return orig(theme, key);
            };

            patchReverse(() => {
                ColorModule.unsafe_rawColors = orig_rawColors;
                ColorModule.meta.resolveSemanticColor = orig;
            });
        }
    );

    return patchReverse;
}