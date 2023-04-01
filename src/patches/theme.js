import { waitForModule } from "../metro";
import { getCurrentTheme } from "../themes";

export default () => {
    const currentTheme = getCurrentTheme();

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