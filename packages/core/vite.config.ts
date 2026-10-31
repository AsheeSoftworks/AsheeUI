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
 *
 * Two entries, because the package publishes two: the contract (`index`) and the data only tooling
 * reads (`@asheeui/core/dev`, C4). `preserveModules` emits every module once, so the second entry
 * costs its own barrel and nothing else — and, deliberately, `matrix.ts` leaves the root entry's
 * graph, which is what stops the inventory being reachable from the contract.
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
      entry: {
        index: resolve(__dirname, "src", "index.ts"),
        dev: resolve(__dirname, "src", "dev.ts"),
      },
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
