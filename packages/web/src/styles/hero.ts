/**
 * The web renderer's class dictionaries for hero.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/marketing/hero/hero-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

/** The grid that places the text column and the media beside each other, on the web. */
export const HERO_LAYOUT_CLASS = "grid items-center gap-10 lg:grid-cols-2";

/** The text column, on the web. */
export const HERO_TEXT_COLUMN_CLASS = "flex min-w-0 flex-col gap-6";

/** Puts the media column first from the `lg` breakpoint upwards, on the web. */
export const HERO_MEDIA_FIRST_CLASS = "lg:order-first";

/** The media column, on the web. */
export const HERO_MEDIA_CLASS = "min-w-0";

/** Added to the text column when the hero is centred, on the web. */
export const HERO_CENTERED_CLASS = "items-center text-center";
