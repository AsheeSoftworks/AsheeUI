import { defineConfig, type ExternalConfig } from "asheeui/config";

const config: ExternalConfig = {
  defaultTheme: "company-red",
  defaultVariant: "ghost",
  defaultColor: "success",
  color: {
    dark: { primary: "#38bdf8", success: "#4ade80" },
    "company-red": {
      extends: "dark",
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
  components: {
    toast: {
      variant: "underlined",
    },
  },
};

export default defineConfig(config);
