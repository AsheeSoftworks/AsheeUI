/**
 * The Carousel's class dictionaries, for both renderers.
 *
 * The padding scale is shared: a slide's inner padding is the framework's spacing, so both
 * renderers compile the same utilities. The height and the frame are not. The web states
 * its height with a step at a breakpoint (`h-80 md:h-[420px]`), because a wide window can
 * afford a taller slide; the platform has one window and one width, so it states the
 * mobile step. The frame differs for the same reason: the web outlines with a two-pixel
 * border and the platform with the single-pixel border its other surfaces use.
 *
 * The platform also states the parts the web leaves to a stylesheet — the track the slides
 * move in, one slide, a control and a dot — so a consumer can restyle any of them through a
 * class, which is what the web's own class props are for.
 *
 * Every entry is a complete, static class string. An unprefixed `CAROUSEL_*` constant is the
 * web renderer's; `NATIVE_CAROUSEL_*` is the native renderer's.
 */

import type { Size } from "../../shared/radius";
import type { CarouselVariant } from "./carousel-config";

/** The height of the carousel at each density, on the web. */
export const CAROUSEL_HEIGHT_CLASS: Record<Size, string> = {
  sm: "h-60 md:h-80",
  md: "h-80 md:h-[420px]",
  lg: "h-[400px] md:h-[520px]",
};

/** The inner padding of a slide at each density. */
export const CAROUSEL_PADDING_CLASS: Record<Size, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/** The frame, per variant, on the web. */
export const CAROUSEL_VARIANT_CLASS: Record<CarouselVariant, string> = {
  bordered: "bg-background border-2 border-border",
  ghost: "bg-transparent",
};

// ─── Native ───────────────────────────────────────────────────────────────────

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
