// Derived from Vendetta's build script
import esbuild from "esbuild";
import swc from "@swc/core";

await esbuild.build({
    entryPoints: ["entry.js"],
    bundle: true,
    minify: false,
    format: "iife",
    target: "esnext",
    outfile: "dist/index.js",
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