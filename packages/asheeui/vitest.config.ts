import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Umbrella package test configuration.
 *
 * The suite imports one entry point for real, so it needs the environment that entry's
 * renderer runs in: the DOM (`jsdom`), the React JSX transform, and the browser
 * boundaries jsdom does not implement. The stubs for those are the web package's own and
 * are referenced rather than copied, because the renderer owns which boundaries it
 * needs and a copy would drift the moment it needs another one.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["@asheeui/web/src/test/setup.ts"],
    restoreMocks: true,
  },
});
