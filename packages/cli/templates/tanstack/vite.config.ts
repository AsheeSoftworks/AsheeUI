import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * The playground's Vite configuration, and its end-to-end test configuration.
 *
 * `tanstackStart` supplies the router's file-route generation and the server
 * rendering entry, so the application is built the way a TanStack Start
 * application is. The test configuration reuses the shared browser stand-ins,
 * because jsdom implements the DOM but not `matchMedia` or the observers.
 */
export default defineConfig({
  plugins: [tanstackStart(), react(), tailwindcss()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.tsx"],
    setupFiles: ["./src/playground/setup.ts"],
    restoreMocks: true,
  },
});
