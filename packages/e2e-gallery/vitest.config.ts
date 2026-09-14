import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * End-to-end gallery test configuration.
 *
 * The gallery is the content the playground applications render, so its own
 * test only has to prove two things: that the gallery satisfies the contract its
 * playgrounds assert, and that the contract reports a problem when a component
 * is missing or wrong. That second half is what keeps the playground assertions
 * from passing vacuously.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./src/setup.ts"],
    restoreMocks: true,
  },
});
