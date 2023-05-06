// Derived from Vendetta's build script
import esbuild from "esbuild";
import swc from "@swc/core";

import { execSync } from "child_process";
import { argv } from "process";

const flags = argv.slice(2).filter((arg) => arg.startsWith("--")).map((arg) => arg.slice(2));

await esbuild.build({
    entryPoints: ["entry.js"],
    bundle: true,
    minify: false,
    format: "iife",
    target: "esnext",
    outfile: "dist/pyoncord.js",
    footer: {
        js: "//# sourceURL=pyoncord",
    },
    legalComments: "none",
    plugins: [{
        name: "swc",
        setup(build) {
            build.onLoad({ filter: /\.[jt]sx?/ }, async (args) => {
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
    }]
});

if (flags.includes("deploy-root")) {
    console.log("Deploying to root...");

    // Hardcode stuff because I'm lazy :trollface:
    const packageName = "com.pyoncord";

    // Make sure to configure the loader to load from an invalid URL so it uses the cache
    execSync("adb wait-for-device root");
    execSync(`adb shell am force-stop ${packageName}`);
    execSync(`adb push dist/pyoncord.js /data/data/${packageName}/cache/vendetta.js`);
    execSync(`adb shell am start ${packageName}/com.discord.main.MainActivity`);
}