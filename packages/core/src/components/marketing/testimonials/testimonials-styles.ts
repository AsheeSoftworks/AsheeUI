/**
 * Every class string the Testimonials band renders, for the web renderer, kept side by side
 * so a change to the band's shape lands on the web at once. Every entry is a
 * complete, static class string, because both Tailwind and NativeWind compile the classes
 * they can read in the source.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

// ─── Web ──────────────────────────────────────────────────────────────────────

/** The quote itself. */
export const TESTIMONIAL_QUOTE_CLASS = "flex flex-col gap-4";

/** The person credited with a quote. */
export const TESTIMONIAL_PERSON_CLASS = "flex items-center gap-3";

/** The heading block above the quotes. */
export const TESTIMONIAL_HEADING_CLASS = "mb-10";

// ─── Native ───────────────────────────────────────────────────────────────────
