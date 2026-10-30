/**
 * The Carousel's class dictionaries, for the web renderer.
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
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { Size } from "../../../shared/radius";

/** The inner padding of a slide at each density. */
export const CAROUSEL_PADDING_CLASS: Record<Size, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

// ─── Native ───────────────────────────────────────────────────────────────────
