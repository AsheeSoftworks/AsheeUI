/**
 * The FeatureGrid's class dictionaries, for the web renderer.
 *
 * A feature card is a card, so the grid states only what is particular to it: the badge that
 * carries a feature's icon, the inner arrangement of a card, and the space the heading keeps
 * above the grid. The card's own surface, density and corners come from the card component
 * on the web, which is what keeps a feature card looking like every other card.
 *
 * Every entry is a complete, static class string. An unprefixed `FEATURE_*` constant is the
 * web renderer's; `NATIVE_FEATURE_*` is the native renderer's.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

/** The badge that holds a feature's icon, on the web. */
export const FEATURE_ICON_CLASS =
  "flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary";

/** The inner arrangement of a feature card, on the web. */
export const FEATURE_CARD_BODY_CLASS = "flex flex-col gap-3";

/** The heading block above the grid, on the web. */
export const FEATURE_HEADING_CLASS = "mb-10";

// ─── Native ───────────────────────────────────────────────────────────────────
