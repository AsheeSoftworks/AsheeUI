import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // The package is the first consumer of the umbrella; tests run against its source.
      asheeui: new URL("../ui/src/index.ts", import.meta.url).pathname,
    },
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["../web/src/test/setup.ts"],
    restoreMocks: true,
    testTimeout: 20_000,
  },
});
