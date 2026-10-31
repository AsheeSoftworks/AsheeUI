import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/**
 * The web application's build.
 *
 * `asheeui` is the only framework import in the source; the umbrella's manifest is what
 * sends it to `@asheeui/web` in this browser build, and the same import in the Expo app
 * goes to `@asheeui/native`. The Tailwind plugin compiles the stylesheet the umbrella
 * ships, not a renderer's path.
 */
export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        autoSubfolderIndex: true,
        failOnError: true,
      },
    }),
    viteReact(),
  ],
});
