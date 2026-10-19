/**
 * Every class string the Testimonials band renders, for both renderers, kept side by side
 * so a change to the band's shape lands on both platforms at once. Every entry is a
 * complete, static class string, because both Tailwind and NativeWind compile the classes
 * they can read in the source.
 */

// ─── Web ──────────────────────────────────────────────────────────────────────

/** The quote itself. */
export const TESTIMONIAL_QUOTE_CLASS = "flex flex-col gap-4";

/** The person credited with a quote. */
export const TESTIMONIAL_PERSON_CLASS = "flex items-center gap-3";

/** The heading block above the quotes. */
export const TESTIMONIAL_HEADING_CLASS = "mb-10";

// ─── Native ───────────────────────────────────────────────────────────────────

/** The native quote: the words above the attribution, whatever the window is. */
export const NATIVE_TESTIMONIAL_QUOTE_CLASS = "flex flex-col gap-4";

/**
 * The native line the person is credited on.
 * The web states no direction, because a block element lays its children along the row
 * already; the platform states the direction it means rather than relying on a default.
 */
export const NATIVE_TESTIMONIAL_PERSON_CLASS =
  "flex flex-row items-center gap-3";

/**
 * The native name and role, which take the room the avatar leaves.
 * A platform text node claims its content's width unless it is told to shrink, and a long
 * role beside a fixed avatar is what makes a row overflow.
 */
export const NATIVE_TESTIMONIAL_PERSON_TEXT_CLASS =
  "flex flex-col flex-1 min-w-0";

/** The heading block above the native quotes. */
export const NATIVE_TESTIMONIAL_HEADING_CLASS = "mb-6 w-full";
