import tailwindcss from "@tailwindcss/postcss";
import { defineConfig } from "vitest/config";

/**
 * The playground's end-to-end test configuration.
 *
 * Next.js owns the build, so the test configuration only has to provide the
 * browser environment and the shared stand-ins: the test itself renders the
 * application's client island and reads the page Next.js prerendered.
 */
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  test: {
    environment: "jsdom",
    include: ["test/**/*.test.tsx"],
    setupFiles: ["./app/playground/setup.ts"],
    restoreMocks: true,
  },
});
