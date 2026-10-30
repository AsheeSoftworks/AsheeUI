/**
 * The platform's class dictionaries for carousel.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/data-display/carousel/carousel-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { CarouselVariant, Size } from "@asheeui/core";

/**
 * The height of the carousel at each density, on the platform.
 *
 * The web steps its height up at a breakpoint, because a wide window can afford a taller
 * slide; the platform has one screen, so it states the step that fits there.
 */
export const NATIVE_CAROUSEL_HEIGHT_CLASS: Record<Size, string> = {
  sm: "h-60",
  md: "h-80",
  lg: "h-[400px]",
};

/** The frame, per variant, on the platform. */
export const NATIVE_CAROUSEL_VARIANT_CLASS: Record<CarouselVariant, string> = {
  bordered: "bg-background border border-border",
  ghost: "bg-transparent",
};

/** The carousel itself, which holds the track and the parts drawn over it. */
export const NATIVE_CAROUSEL_BASE_CLASS = "relative w-full overflow-hidden";

/** The track the slides move along. */
export const NATIVE_CAROUSEL_TRACK_CLASS = "flex-1";

/** One slide, which is as wide as the carousel and centres what it holds. */
export const NATIVE_CAROUSEL_SLIDE_CLASS =
  "items-center justify-center overflow-hidden h-full";

/** A control, which is drawn over the track. */
export const NATIVE_CAROUSEL_CONTROL_CLASS =
  "absolute items-center justify-center rounded-full bg-background/80 min-h-[44px] min-w-[44px]";

/** The previous control's position. */
export const NATIVE_CAROUSEL_PREV_CLASS = "left-2 top-1/2 -mt-5";

/** The next control's position. */
export const NATIVE_CAROUSEL_NEXT_CLASS = "right-2 top-1/2 -mt-5";

/** The row of dots. */
export const NATIVE_CAROUSEL_INDICATORS_CLASS =
  "absolute bottom-2 left-0 right-0 flex-row items-center justify-center gap-2";

/**
 * One dot's hit area, which is a target a thumb reaches for rather than the mark itself.
 */
export const NATIVE_CAROUSEL_INDICATOR_CLASS =
  "items-center justify-center min-h-[44px] min-w-[44px]";

/** The mark inside a dot, which is what a reader actually sees. */
export const NATIVE_CAROUSEL_INDICATOR_DOT_CLASS = "w-2 h-2 rounded-full";

/** The colour of the mark, per state. */
export const NATIVE_CAROUSEL_INDICATOR_MARK_CLASS: Record<
  "active" | "resting",
  string
> = {
  active: "bg-primary",
  resting: "bg-foreground/30",
};

/**
 * The characters the platform's controls show.
 *
 * The web draws a chevron in an icon set this package does not ship; the platform states the
 * same thing with a character, as the framework's native accordion and picker do.
 */
export const NATIVE_CAROUSEL_PREV_GLYPH = "‹";

/** The character the next control shows. */
export const NATIVE_CAROUSEL_NEXT_GLYPH = "›";
