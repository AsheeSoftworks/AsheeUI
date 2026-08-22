import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "node/index": "src/node/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
});
