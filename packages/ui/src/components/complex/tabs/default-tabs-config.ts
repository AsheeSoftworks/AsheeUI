import type { TabsConfig, TabsSizeScale } from "./tabs-config";

export const defaultTabsSizeScale: TabsSizeScale = {
  default: "md",
  values: {
    sm: {
      height: { base: "2rem" },
      paddingX: { base: "0.625rem" },
      fontSize: { base: "0.875rem" },
    },
    md: {
      height: { base: "2.5rem" },
      paddingX: { base: "0.875rem" },
      fontSize: { base: "1rem" },
    },
    lg: {
      height: { base: "3rem" },
      paddingX: { base: "1rem" },
      fontSize: { base: "1.125rem" },
    },
  },
};

export const defaultTabsConfig: TabsConfig = {
  size: defaultTabsSizeScale,
  variant: "underline",
  radius: "md",
  animation: "fade",
};
