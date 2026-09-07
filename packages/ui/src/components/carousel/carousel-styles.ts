/**
 * Carousel component styles for AsheeUI.
 * This file provides CSS class mappings for the Carousel component's
 * height, padding, and variant options.
 */

import type { Size } from "../../shared";
import type { CarouselVariant } from "./carousel-config";

/**
 * CSS classes for carousel height based on size.
 * Controls the fixed height of the carousel container.
 */
export const CAROUSEL_HEIGHT_CLASS: Record<Size, string> = {
  sm: "h-60 md:h-80",
  md: "h-80 md:h-[420px]",
  lg: "h-[400px] md:h-[520px]",
};

/**
 * CSS classes for carousel padding based on size.
 * Controls the internal padding of each slide.
 */
export const CAROUSEL_PADDING_CLASS: Record<Size, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/**import type { Size } from "../../shared";
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

 * CSS classes for carousel variants.
 * Each variant has a distinct background and border treatment.
 */
export const CAROUSEL_VARIANT_CLASS: Record<CarouselVariant, string> = {
  bordered: "bg-background border-2 border-border",
  ghost: "bg-transparent",
};
