## pyoncord

pyoncord, *yet* another Discord mobile client mod made to enhance Discord mobile experience. It currently is very WIP, and is not getting actively worked on. A few inbuilt patches has been implemented at the moment so this mod at least have some functionalities :trollface:.

Current inbuilt patches are: Experiments, NoGiftButton, NoIdle and [Monokai Night](https://github.com/Fierdetta/themes/blob/main/monokai-night.json) theme

### What's so different about this mod?
pyoncord has a different approach in how it fetches Discord modules. Unlike other mods, pyoncord waits for Discord to initialize a module, which is lazy loaded. This enables a faster start-up and prevents issues such as the [light/AMOLED theme bug](https://github.com/Aliucord/AliucordRN/issues/39) and [Hindi timestamps](https://github.com/enmity-mod/enmity/issues/11).

### Limitations
Due to how pyoncord fetches Discord modules, modules may be required before they're loaded. This is unlikely to affect patches--but when requiring UI components. This limitation is why this mod exists in the first place, as it needs an entire rewrite to implement this approach in an existing mod. Anything "[mod-name]Compat" is also not possible.

### How can I try this?
pyoncord supports loading from Vendetta's loader, you can load pyoncord by overriding the loader url to load pyoncord instead. Be familiar with Vendetta development environment: [Vendetta#installing](https://github.com/vendetta-mod/Vendetta#i]nstalling) and [Vendetta#contributing](https://github.com/vendetta-mod/Vendetta#contributing).