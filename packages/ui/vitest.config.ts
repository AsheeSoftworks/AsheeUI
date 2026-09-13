import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * UI package test configuration.
 *
 * Tests are co-located with the code they cover (`src/**\/*.test.ts[x]`) and
 * shared utilities live in `src/test/` (`TEST-025`). The DOM environment is
 * jsdom (`TEST-015`); browser-mode testing and visual regression are not
 * adopted (`TEST-016`, resolved in M1).
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./src/test/setup.ts"],
    restoreMocks: true,
  },
});
