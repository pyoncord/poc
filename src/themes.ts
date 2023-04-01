// export function getCurrentTheme() {
//     const themeProp = window.__vendetta_loader?.features?.themes?.prop;
//     if (!themeProp) return null;
//     return window[themeProp] || null;
// }

export function getCurrentTheme() {
    // hardcoding the https://github.com/Fierdetta/themes/blob/main/monokai-night.json for now
    return {
        data: {
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
        }
    }
}