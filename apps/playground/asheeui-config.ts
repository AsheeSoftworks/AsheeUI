// apps/playground/src/asheeui-config.ts
import { defineConfig } from "@ashee/config";

export default defineConfig({
  theme: {
    defaultTheme: "system",
    color: {
      dark: { primary: "#005bc4" },
      "company-red": {
        background: "#1a0505",
        foreground: "#fef2f2",
        primary: "#dc2626",
        secondary: "#2a0a0a",
        border: "#7f1d1d",
        danger: "#f87171",
        warning: "#fb923c",
        success: "#4ade80",
        scrollbarThumb: "#991b1b",
        scrollbarTrack: "#1a0505",
      },
    },
  },
});
