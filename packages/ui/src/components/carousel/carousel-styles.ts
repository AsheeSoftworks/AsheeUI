import type { CarouselSizeKey, CarouselVariant } from "./carousel-config";

export const CAROUSEL_HEIGHT_CLASS: Record<CarouselSizeKey, string> = {
  sm: "h-60 md:h-80",
  md: "h-80 md:h-[420px]",
  lg: "h-[400px] md:h-[520px]",
};

export const CAROUSEL_PADDING_CLASS: Record<CarouselSizeKey, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const CAROUSEL_RADIUS_CLASS: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export const CAROUSEL_VARIANT_CLASS: Record<CarouselVariant, string> = {
  default: "bg-card border border-border shadow-xs",
  cards: "bg-card border border-border/60 shadow-lg",
  bordered: "bg-background border-2 border-border",
  ghost: "bg-transparent",
};
