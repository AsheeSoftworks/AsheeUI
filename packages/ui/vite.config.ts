/// <reference types="node" />

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Copies the package stylesheet into the dist output. */
function copyStyles(): Plugin {
  return {
    name: "asheeui-copy-styles",
    closeBundle() {
      const src = resolve(__dirname, "src", "index.css");
      const dest = resolve(__dirname, "dist", "index.css");
      mkdirSync(dirname(dest), { recursive: true });
      copyFileSync(src, dest);
    },
  };
}

/**
 * Rollup drops barrel files (index.ts that only re-export) during bundling,
 * leaving only the implementation modules in dist. This plugin regenerates
 * the missing index.js barrels so import maps like
 * "asheeui/button" -> dist/components/button/index.js resolve at runtime.
 */
function generateBarrels(): Plugin {
  return {
    name: "asheeui-generate-barrels",
    closeBundle() {
      const distRoot = resolve(__dirname, "dist");
      const distComponents = resolve(distRoot, "components");

      const listModules = (dir: string): string[] =>
        existsSync(dir)
          ? readdirSync(dir, { withFileTypes: true })
              .filter(
                (entry) =>
                  entry.isFile() &&
                  entry.name.endsWith(".js") &&
                  !entry.name.endsWith(".map") &&
                  entry.name !== "index.js",
              )
              .map((entry) => entry.name.replace(/\.js$/, ""))
              .sort()
          : [];

      const writeBarrel = (dir: string, modules: string[]) => {
        if (modules.length === 0) return;
        const lines = modules.map((mod) => `export * from "./${mod}.js";`);
        writeFileSync(join(dir, "index.js"), `${lines.join("\n")}\n`, "utf8");
      };

      // Regenerate per-component barrels (e.g. dist/components/button/index.js)
      if (existsSync(distComponents)) {
        for (const entry of readdirSync(distComponents, {
          withFileTypes: true,
        })) {
          if (entry.isDirectory()) {
            const componentDir = join(distComponents, entry.name);
            writeBarrel(componentDir, listModules(componentDir));
          }
        }
      }

      // Regenerate dist/config, dist/libs and dist/utils barrels referenced by exports map
      for (const sub of ["config", "libs", "utils"]) {
        const dir = join(distRoot, sub);
        if (existsSync(dir)) {
          writeBarrel(dir, listModules(dir));
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: "src",
      include: ["src"],
      exclude: ["src/scripts/**", "src/**/*.test.*"],
    }),
    copyStyles(),
    generateBarrels(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@floating-ui/react",
        "clsx",
        "tailwind-merge",
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        banner: '"use client";\n',
      },
    },
  },
});
