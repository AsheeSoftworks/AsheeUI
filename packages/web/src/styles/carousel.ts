/**
 * The web renderer's class dictionaries for carousel.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/data-display/carousel/carousel-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { CarouselVariant, Size } from "@asheeui/core";

/** The height of the carousel at each density, on the web. */
export const CAROUSEL_HEIGHT_CLASS: Record<Size, string> = {
  sm: "h-60 md:h-80",
  md: "h-80 md:h-[420px]",
  lg: "h-[400px] md:h-[520px]",
};

/** The frame, per variant, on the web. */
export const CAROUSEL_VARIANT_CLASS: Record<CarouselVariant, string> = {
  bordered: "bg-background border-2 border-border",
  ghost: "bg-transparent",
};
