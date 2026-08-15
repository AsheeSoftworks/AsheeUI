import type { LinkConfig, LinkSizeScale } from "./link-config";

export const defaultLinkSizeScale: LinkSizeScale = {
  default: "md",
  values: {
    sm: {
      fontSize: { base: "0.875rem" },
      gap: { base: "0.375rem" },
      iconSize: { base: "0.875rem" },
    },
    md: {
      fontSize: { base: "1rem" },
      gap: { base: "0.5rem" },
      iconSize: { base: "1rem" },
    },
    lg: {
      fontSize: { base: "1.125rem" },
      gap: { base: "0.625rem" },
      iconSize: { base: "1.125rem" },
    },
  },
};

export const defaultLinkConfig: LinkConfig = {
  size: defaultLinkSizeScale,
  underline: "hover",
  weight: "medium",
  lineHeight: "base",
  isExternal: false,
};
