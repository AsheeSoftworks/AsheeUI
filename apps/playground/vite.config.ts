import { asheeui } from "@asheeui/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
// import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    asheeui(),
    react(),
    tailwindcss(),
    // visualizer({ open: true, filename: "bundle-analysis.html" }),
  ],
});
