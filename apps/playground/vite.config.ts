// apps/playground/vite.config.ts
import { asheeui } from "@ashee/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss(), asheeui()],
  optimizeDeps: {
    exclude: ["@ashee/ui", "@ashee/theme"],
  },
});
