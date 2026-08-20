import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { asheeui } from "@asheeui/vite";

export default defineConfig({
  plugins: [asheeui(), react(), tailwindcss()],
});
