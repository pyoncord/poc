## pyoncord

Pyoncord, *yet* another Discord mobile client mod made to enhance Discord mobile experience. It currently is very WIP, and is not getting actively worked on. A few inbuilt patches has been implemented at the moment so this mod at least have some functionalities.

Current inbuilt patches are: Experiments, NoGiftButton and NoIdle

Use [Vendetta](https://github.com/vendetta-mod/Vendetta) for more active development and community.

### What's so different about this mod?
Pyoncord has a different approach in how it fetches Discord modules. Unlike other mods, pyoncord waits for Discord to initialize a module, which is lazy loaded. This enables a faster start-up and prevents issues such as the [light/AMOLED theme bug](https://github.com/Aliucord/AliucordRN/issues/39) and [Hindi timestamps](https://github.com/enmity-mod/enmity/issues/11).

### Limitations
Due to how Pyoncord fetches Discord modules, modules may be required before they're loaded. This is unlikely to affect patches--but when requiring UI components. This *might* be solvable with a custom Hermes, which is planned.

This limitation is why this mod exists in the first place, as rearchitecturing is needed to implement this approach in an existing mod. This also makes addons compatibility for other mods nearly impossible.

### How can I try/contribute to this?
Pyoncord supports loading from Vendetta's loader, you can load Pyoncord by overriding the loader url to load Pyoncord instead. Be familiar with Vendetta development environment: [Vendetta#installing](https://github.com/vendetta-mod/Vendetta#installing) and [Vendetta#contributing](https://github.com/vendetta-mod/Vendetta#contributing).