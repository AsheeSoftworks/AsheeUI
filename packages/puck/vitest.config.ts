import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Vitest configuration for the Puck package's web half and its shared layer.
 *
 * The shared layer is platform-free — it holds the block specs the two renderers read
 * — so it needs no DOM of its own, and it runs here rather than under Jest because a
 * Node environment is enough for it. The web half renders real Puck blocks, so it runs
 * in the DOM (`jsdom`) with the web package's own boundary stubs, referenced rather
 * than copied so the two cannot drift.
 *
 * The native half is deliberately outside `include`: it imports React Native, which
 * only the platform's runner can transform, and it is covered by Jest.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: [
      "src/*.test.{ts,tsx}",
      "src/shared/**/*.test.{ts,tsx}",
      "src/web/**/*.test.{ts,tsx}",
    ],
    setupFiles: ["@asheeui/web/src/test/setup.ts"],
    restoreMocks: true,
  },
});
