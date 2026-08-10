import type { TooltipConfig, TooltipSizeScale } from "./tooltip-config";

export const defaultTooltipSizeScale: TooltipSizeScale = {
  default: "md",
  values: {
    sm: {
      paddingX: { base: "0.5rem" },
      paddingY: { base: "0.25rem" },
      fontSize: { base: "0.75rem" },
    },
    md: {
      paddingX: { base: "0.75rem" },
      paddingY: { base: "0.375rem" },
      fontSize: { base: "0.875rem" },
    },
    lg: {
      paddingX: { base: "1rem" },
      paddingY: { base: "0.5rem" },
      fontSize: { base: "1rem" },
    },
  },
};

export const defaultTooltipConfig: TooltipConfig = {
  variant: "solid",
  color: "secondary",
  size: defaultTooltipSizeScale,
  placement: "top",
  delay: 200,
  offset: 8,
  radius: "md",
  shadow: "md",
  animation: "scale",
  showArrow: false,
};
