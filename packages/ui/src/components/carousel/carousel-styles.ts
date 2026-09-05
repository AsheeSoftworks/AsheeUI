import type { Size } from "../../shared/size";
import type { CarouselVariant } from "./carousel-config";

export const CAROUSEL_HEIGHT_CLASS: Record<Size, string> = {
  sm: "h-60 md:h-80",
  md: "h-80 md:h-[420px]",
  lg: "h-[400px] md:h-[520px]",
};

export const CAROUSEL_PADDING_CLASS: Record<Size, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const CAROUSEL_VARIANT_CLASS: Record<CarouselVariant, string> = {
  bordered: "bg-background border-2 border-border",
  ghost: "bg-transparent",
};
