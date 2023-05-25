// Derived from Vendetta's build script
import swc from "@swc/core";
import { execSync } from "child_process";
import esbuild from "esbuild";
import globalsPlugin from "esbuild-plugin-globals";
import { argv } from "process";

const flags = argv.slice(2).filter(arg => arg.startsWith("--")).map(arg => arg.slice(2));
const isDev = !flags.includes("release");

const commitHash = execSync("git rev-parse --short HEAD").toString().trim();
console.log(`Building with commit hash ${commitHash}, isDev=${isDev}`);

const buildOutput = "dist/pyoncord.js";

/** @type {import("esbuild").Plugin}  */
const swcPlugin = {
    name: "swc",
    setup(build) {
        build.onLoad({ filter: /\.[jt]sx?/ }, async args => {
            const result = await swc.transformFile(args.path, {
                jsc: {
                    target: "esnext",
                    externalHelpers: true,
                },
                env: {
                    targets: "defaults",
                    include: [
                        "transform-classes",
                        "transform-arrow-functions",
                    ],
                },
            });
            return { contents: result.code };
        });
    }
};

await esbuild.build({
    entryPoints: ["entry.js"],
    bundle: true,
    minify: !isDev,
    format: "iife",
    target: "esnext",
    outfile: buildOutput,
    footer: {
        js: "//# sourceURL=pyoncord",
    },
    define: {
        __PYONCORD_COMMIT_HASH__: JSON.stringify(commitHash),
        __PYONCORD_DEV__: JSON.stringify(isDev),
    },
    legalComments: "none",
    alias: {
        "@/*": "./src/*"
    },
    plugins: [
        swcPlugin
    ]
});

console.log("Build complete!");

if (flags.includes("deploy-root")) {
    console.log("Deploying to device with root...");

    // Hardcode stuff because I'm lazy :trollface:
    const packageName = "com.discord";

    // Make sure to configure the loader to load from an invalid URL so it uses the cache
    // This is still an issue because the cache is cleared intervally so we need to make our own loader
    execSync("adb wait-for-device root");
    execSync(`adb shell am force-stop ${packageName}`);
    execSync(`adb push ${buildOutput} /data/data/${packageName}/files/pyoncord/pyoncord.js`);
    execSync(`adb shell am start ${packageName}/com.discord.main.MainActivity`);
}
