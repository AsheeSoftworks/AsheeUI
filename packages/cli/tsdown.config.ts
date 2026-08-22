import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  noExternal: ["@asheeui/utils"], // Inlines internal utils package into dist/
});
