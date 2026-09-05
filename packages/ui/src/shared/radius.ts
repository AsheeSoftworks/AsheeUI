import type { Variant } from "./variant";

export type Radius = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "full";

export const RADIUS_CLASS: Record<Radius, string> = {
  none: "rounded-none",
  xs: "rounded-xs",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export const UnderlineRadius = (variant: Variant, radius: Radius): Radius => {
  if (variant === "underlined") {
    return "none";
  }
  return radius;
};
