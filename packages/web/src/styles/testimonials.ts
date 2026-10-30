/**
 * The web renderer's class dictionaries for testimonials.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/marketing/testimonials/testimonials-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

/** The quote itself. */
export const TESTIMONIAL_QUOTE_CLASS = "flex flex-col gap-4";

/** The person credited with a quote. */
export const TESTIMONIAL_PERSON_CLASS = "flex items-center gap-3";

/** The heading block above the quotes. */
export const TESTIMONIAL_HEADING_CLASS = "mb-10";
