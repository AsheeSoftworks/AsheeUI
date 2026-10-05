/// <reference types="node" />

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Library build for `@asheeui/core`.
 *
 * One step emits the ESM bundle and its declarations, module by module, so the
 * package keeps the shape of `src` and stays debuggable in a consumer's bundle.
 * The two class-composition libraries are external: both platforms already bring
 * them, and a shared layer must not duplicate what its consumers install.
 */
export default defineConfig({
  plugins: [
    dts({
      entryRoot: "src",
      include: ["src"],
      exclude: ["src/**/*.test.*"],
    }),
  ],
  build: {
    lib: {
      entry: { index: resolve(__dirname, "src", "index.ts") },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["clsx", "tailwind-merge"],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
  },
});
