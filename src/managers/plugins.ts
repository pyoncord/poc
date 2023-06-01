import { SettingsAPI } from "@api";
import { readFile } from "@native";

interface Plugin {
    name: string;
    enabled: boolean;
    description: string;
    version: string;
    js: string;
}

type PluginReturn = {
    onLoad?: () => void;
    onUnload?: () => void;
};

export const pluginStorage = new SettingsAPI<Plugin[]>("plugins/plugins.json", [
    // {
    //     name: "NoAutoReplyMention",
    //     description: "Turns off auto mention when replying",
    //     version: "1.0.0", // Keep?
    //     js: "noAutoReplyMention.js"
    // }
]);

export const pluginInstances = new Map<string, PluginReturn>();

async function loadPlugin(plugin: Plugin) {
    const pluginJS = await readFile(`plugins/${plugin.js}`);
    const wrappedJS = `(()=>{return ${pluginJS}})//# sourceURL=pyon-plugin-${plugin.name}`;

    try {
        const evaled = eval?.(wrappedJS)();
        const ret: PluginReturn = evaled?.default ?? evaled ?? {};

        ret.onLoad?.();
        pluginInstances.set(plugin.name, ret);

        console.log(`Loaded plugin ${plugin.name}`);
    } catch (err) {
        console.error(`Failed to load plugin ${plugin.name}: ${err}`);
        delete pluginInstances[plugin.name];
    }
}

export async function loadPlugins() {
    await pluginStorage.init();

    for (const plugin of pluginStorage.proxy) if (plugin.enabled) {
        loadPlugin(plugin);
    }
}
