/**
 * The platform's class dictionaries for testimonials.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/marketing/testimonials/testimonials-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

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
