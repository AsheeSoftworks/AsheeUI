/**
 * The FeatureGrid's class dictionaries, for both renderers.
 *
 * A feature card is a card, so the grid states only what is particular to it: the badge that
 * carries a feature's icon, the inner arrangement of a card, and the space the heading keeps
 * above the grid. The card's own surface, density and corners come from the card component
 * on both platforms, which is what keeps a feature card looking like every other card.
 *
 * Every entry is a complete, static class string. An unprefixed `FEATURE_*` constant is the
 * web renderer's; `NATIVE_FEATURE_*` is the native renderer's.
 */

/** The badge that holds a feature's icon, on the web. */
export const FEATURE_ICON_CLASS =
  "flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary";

/** The inner arrangement of a feature card, on the web. */
export const FEATURE_CARD_BODY_CLASS = "flex flex-col gap-3";

/** The heading block above the grid, on the web. */
export const FEATURE_HEADING_CLASS = "mb-10";

// ─── Native ───────────────────────────────────────────────────────────────────

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
