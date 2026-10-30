/**
 * The platform's class dictionaries for feature-grid.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/marketing/feature-grid/feature-grid-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

/**
 * The badge that holds a feature's icon, on the platform.
 * The web writes its size as `size-10`; the platform states the width and the height, which
 * is the spelling its compiler reads.
 */
export const NATIVE_FEATURE_ICON_CLASS =
  "w-10 h-10 items-center justify-center rounded-md bg-primary/10";

/**
 * The colour of the platform badge's glyph.
 * The web's badge carries the colour for the icon to inherit through `currentColor`; the
 * platform draws the icon as a child view, so the tone is named on the badge itself.
 */
export const NATIVE_FEATURE_ICON_TONE_CLASS = "text-primary";

/** The inner arrangement of a feature card, on the platform. */
export const NATIVE_FEATURE_CARD_BODY_CLASS = "flex-col gap-2";

/** The heading block above the grid, on the platform. */
export const NATIVE_FEATURE_HEADING_CLASS = "mb-6 w-full";
