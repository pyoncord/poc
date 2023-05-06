import { waitForModule } from "../metro";
import { getCurrentTheme } from "../themes";

import Patcher from "../patcher";

const patcher = new Patcher("theme-patcher");

// TODO: Implement theming
export default async () => {
    return;

    const currentTheme = getCurrentTheme() as any;

    waitForModule(
        (m) => m?.unsafe_rawColors && m.meta,
        (ColorModule) => {
            let semanticColorsSymbol;
            const orig_rawColors = ColorModule.unsafe_rawColors;

            ColorModule.unsafe_rawColors = {
                ...ColorModule.unsafe_rawColors,
                ...currentTheme.data.rawColors
            };

            patcher.addUnpatcher(() => {
                ColorModule.unsafe_rawColors = orig_rawColors;
            });

            patcher.instead(ColorModule.meta, "resolveSemanticColor", ([theme, key], orig) => {
                const realKey = key[semanticColorsSymbol ??= Object.getOwnPropertySymbols(key)[0]];
                const themeIndex = theme === "dark" ? 0 : theme === "light" ? 1 : 2;

                if (currentTheme.data.semanticColors[realKey]?.[themeIndex]) {
                    return currentTheme.data.semanticColors[realKey][themeIndex];
                }

                return orig(theme, key);
            })
        }
    );

    return () => patcher.unpatchAllAndStop();
}