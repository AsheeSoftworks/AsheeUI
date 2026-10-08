/// <reference types="node" />

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
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
 * "@asheeui/web/button" -> dist/components/button/index.js resolve at runtime.
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

/**
 * Declarations are generated from source, so an import of the core package is
 * written back as a path into it: the source tree (`../../core/src/index.ts`)
 * while the source is what resolves, and the built types
 * (`../../core/dist/index.d.ts`) once the declarations are read from them. Both
 * paths escape the published package, so the declarations are pointed at the
 * package instead — the same specifier the JavaScript output already uses, and
 * the same dependency the manifest declares.
 */
function rewriteCoreSpecifiers(): Plugin {
  return {
    name: "asheeui-rewrite-core-specifiers",
    closeBundle() {
      const distRoot = resolve(__dirname, "dist");
      const listDeclarations = (dir: string): string[] =>
        readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
          const full = join(dir, entry.name);
          if (entry.isDirectory()) return listDeclarations(full);
          return entry.isFile() && entry.name.endsWith(".d.ts") ? [full] : [];
        });

      for (const file of listDeclarations(distRoot)) {
        const text = readFileSync(file, "utf8");
        const rewritten = text.replace(
          /(?:\.\.\/)+core\/(?:src|dist)\/index(?:\.d)?\.ts/g,
          "@asheeui/core",
        );
        if (rewritten !== text) writeFileSync(file, rewritten, "utf8");
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
      exclude: ["src/scripts/**", "src/test/**", "src/**/*.test.*"],
    }),
    copyStyles(),
    generateBarrels(),
    rewriteCoreSpecifiers(),
  ],
  build: {
    lib: {
      // Two entries: the framework itself, and the section kit behind its own
      // subpath (`@asheeui/web/section-kit`). Rollup only emits a module that the
      // graph reaches, and the main entry deliberately does not reach the kit — an
      // application that never composes a band does not load it — so the subpath has
      // to be an entry of its own or it would ship declarations without an
      // implementation. The kit is the one internal module another package composes
      // with: the Puck integration draws a band's heading and action row through it.
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        "components/section-kit/index": resolve(
          __dirname,
          "src/components/section-kit/index.ts",
        ),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "@asheeui/core",
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@floating-ui/react",
        "@puckeditor/core",
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
