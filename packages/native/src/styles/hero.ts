/**
 * The platform's class dictionaries for hero.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/marketing/hero/hero-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

/** The band itself, on the platform. */
export const NATIVE_HERO_BASE_CLASS = "w-full";

/**
 * The arrangement of a hero that has media, on the platform.
 *
 * The platform states one arrangement and the component picks it from the window it measures
 * rather than from a class variant: a phone stacks the media under the text, and a window
 * with room for two columns puts them beside each other. A hero without media uses neither.
 */
export const NATIVE_HERO_ROW_CLASS = "flex-row items-center gap-8";

/** The stacked arrangement of a hero that has media, on the platform. */
export const NATIVE_HERO_COLUMN_CLASS = "flex-col gap-6";

/** The text column, on the platform. */
export const NATIVE_HERO_TEXT_COLUMN_CLASS = "flex-1 w-full gap-4";

/** The media column, on the platform. */
export const NATIVE_HERO_MEDIA_CLASS = "flex-1 w-full";
