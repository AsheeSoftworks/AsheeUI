import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * UI package test configuration.
 *
 * Tests are co-located with the code they cover (`src/**\/*.test.ts[x]`) and
 * shared utilities live in `src/test/` (`TEST-025`). The DOM environment is
 * jsdom (`TEST-015`); browser-mode testing and visual regression are not
 * adopted (`TEST-016`, resolved in M1).
 *
 * `testTimeout` is raised from the 5s default because a jsdom environment is created per
 * test file — 83 of them, which the runner measured at ~280s of the suite's time — so a
 * file's first test pays for its environment. In isolation that is well under a second;
 * beside five other packages' suites in `turbo run test` it is not, and a DOM-heavy file
 * would fail on the clock rather than on its assertions. The budget states what these
 * tests need instead of making the whole pipeline flaky.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./src/test/setup.ts"],
    restoreMocks: true,
    testTimeout: 20_000,
  },
});
