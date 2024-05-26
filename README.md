> [!IMPORTANT]
> Due to maintenance difficulties *(why? read below)*, this project is now discontinued, hence being marked as a "proof-of-concept" project since it was never finished. Worry not, I am working on an alternative, which is a fork and a drop-in Vendetta replacement, [Bunny](https://github.com/pyoncord/Bunny).

## Pyoncord (client mod)

##### Pyoncord is often confused with [Bunny](https://github.com/pyoncord/Bunny). Pyoncord nowadays only exists as a form of "team" or community. If you see Pyoncord being mentioned as a client mod, it is likely referring to [Bunny](https://github.com/pyoncord/Bunny) rather than this discontinued project.

Pyoncord *was* an experimental Discord mobile client mod that was not seriously made to compete with any other client mod and also a proof-of-concept of implementing lazy [Metro](https://github.com/facebook/metro) bundle runtime patching. Instead of force initializing all modules in the registry to find and patch, Pyoncord waits until Discord itself initializes a module when they require it and patches its exports right before Discord uses them.

Thanks to [Hermes](https://github.com/facebook/hermes)' limitations, we are unable to depend on Discord's modules and libraries bundled with it, thus integrating this concept into an existing mod (like [Vendetta](https://github.com/vendetta-mod/Vendetta/)) isn't possible and mostly requires rewriting from the ground up (otherwise this project wouldn't exist as, fun fact, I was a part of Team Vendetta :nyaboom:).

Due to how torturous it is for me to work on this mod with fragile goals, along with the discovery of another approach to achieve similar benefits, I've decided to drop this project without it being finished. The "other approach" is expected to be integrated into [Bunny](https://github.com/pyoncord/Bunny), Pyoncord's iteration of Vendetta.