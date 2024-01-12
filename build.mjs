// Derived from Vendetta's build script
import swc from "@swc/core";
import { execSync } from "child_process";
import { createHash } from "crypto";
import esbuild from "esbuild";
import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { createServer } from "http";
import { argv } from "process";

const flags = argv.slice(2).filter(arg => arg.startsWith("--")).map(arg => arg.slice(2));
const isDev = !flags.includes("release");
const shouldServe = flags.includes("serve");
const shouldWatch = flags.includes("watch");

const commitHash = execSync("git rev-parse --short HEAD").toString().trim();
console.log(`Building with commit hash ${commitHash}, isDev=${isDev}`);

/** @type {import("esbuild").Plugin}  */
const swcPlugin = {
    name: "swc",
    setup(build) {
        build.onLoad({ filter: /\.[jt]sx?/ }, async args => {
            if (args.path?.includes(".json")) return;

            const result = await swc.transformFile(args.path, {
                jsc: {
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

try {
    const ctx = await esbuild.context({
        entryPoints: ["entry.js"],
        bundle: true,
        minify: !isDev,
        format: "esm",
        target: "esnext",
        outfile: "dist/pyoncord.js",
        keepNames: true,
        write: false,
        define: {
            __PYONCORD_COMMIT_HASH__: JSON.stringify(commitHash),
            __PYONCORD_DEV__: JSON.stringify(isDev)
        },
        legalComments: "none",
        alias: {
            "@/*": "./src/*"
        },
        plugins: [
            swcPlugin,
            {
                name: "bundleWrapper",
                setup: build => {
                    build.onEnd(async r => {
                        const { text, path } = r.outputFiles[0];

                        const moduleDefHash = createHash("sha256").update(await readFile("internal-metro/requireDef.ts")).digest("hex");

                        const contents = [
                            `globalThis.__PYON_MODULE_DEFINITIONS_HASH__='${moduleDefHash}';`,
                            `(async function(){${text}})().catch(e => alert(e?.stack ?? e));`,
                            "//# sourceURL=pyoncord"
                        ].join("\n");

                        !existsSync("dist") && await mkdir("dist");
                        await writeFile(path, contents);
                    });
                }
            },
            {
                name: "buildLog",
                setup: async build => {
                    build.onStart(() => console.log(`Building commit ${commitHash}, isDev=${isDev}...`));
                    build.onEnd(result => console.log(`Built with ${result.errors?.length} errors!`));
                }
            }
        ]
    });

    if (shouldWatch) {
        await ctx.watch();
        console.log("Watching...");
    }

    if (shouldServe) {
        const server = createServer(async (req, res) => {
            try {
                if (req.url.endsWith("/vendetta.js") || req.url.endsWith("/pyoncord.js")) {
                    await ctx.rebuild();
                    const content = await readFile("./dist/pyoncord.js");
                    res.writeHead(200);
                    res.end(content, "utf-8");
                } else {
                    res.writeHead(404);
                    res.end();
                }
            } catch (error) {
                res.writeHead(500);
                res.end();
            }
        }).listen(4040);

        console.log(`Serving on port ${server.address().port}, CTRL+C to stop`);
    }

    if (!shouldServe && !shouldWatch) {
        ctx.rebuild();
        ctx.dispose();
    }
} catch (e) {
    console.error("Build failed...", e);
    process.exit(1);
}
