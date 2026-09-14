import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * The playground's Vite configuration, and its end-to-end test configuration.
 *
 * Tailwind is added the way a consumer adds it, so the utilities the components
 * use are generated from the library's own sources through the
 * `@import "asheeui/styles"` line in `src/index.css`. The test configuration
 * reuses the shared browser stand-ins, because jsdom implements the DOM but not
 * `matchMedia` or the observers.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.tsx"],
    setupFiles: ["@asheeui/e2e-gallery/setup"],
    restoreMocks: true,
  },
});
