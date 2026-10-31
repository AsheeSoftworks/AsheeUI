/**
 * The web renderer's class dictionaries for feature-grid.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/marketing/feature-grid/feature-grid-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

/** The badge that holds a feature's icon, on the web. */
export const FEATURE_ICON_CLASS =
  "flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary";

/** The inner arrangement of a feature card, on the web. */
export const FEATURE_CARD_BODY_CLASS = "flex flex-col gap-3";

/** The heading block above the grid, on the web. */
export const FEATURE_HEADING_CLASS = "mb-10";
