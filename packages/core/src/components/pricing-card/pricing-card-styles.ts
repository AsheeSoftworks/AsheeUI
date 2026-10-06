/**
 * Every class string the PricingCard renders, for both renderers, kept side by side so a
 * change to the pattern's shape lands on both platforms at once. Every entry is a complete,
 * static class string, because both Tailwind and NativeWind compile the classes they can
 * read in the source.
 *
 * The pattern's own anatomy is shared: the price line, the feature list, a feature line,
 * the badge and the arrangement of the body. What the two platforms state differently is
 * the marker of an included or excluded line — a drawing on the web and a character on the
 * platform — and the mark of the recommended plan, which the web paints as a ring and the
 * platform states as the card's own accent colour.
 */

// ─── Web ──────────────────────────────────────────────────────────────────────

/** The price line, where the amount and the period sit on one baseline. */
export const PRICING_PRICE_CLASS = "flex items-baseline gap-1";

/** The list of included and excluded features. */
export const PRICING_FEATURES_CLASS = "flex flex-col gap-2";

/** One feature line. */
export const PRICING_FEATURE_CLASS = "flex items-start gap-2";

/** The marker of an included feature. */
export const PRICING_FEATURE_INCLUDED_CLASS =
  "mt-1 size-4 shrink-0 text-success";

/** The marker of an excluded feature. */
export const PRICING_FEATURE_EXCLUDED_CLASS =
  "mt-1 size-4 shrink-0 text-foreground/40";

/** The badge above the plan name. */
export const PRICING_BADGE_CLASS =
  "inline-flex w-fit items-center rounded-sm bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary";

/** The ring that marks the recommended plan. */
export const PRICING_HIGHLIGHTED_CLASS = "border-primary ring-1 ring-primary";

/** The body arrangement of the card. */
export const PRICING_BODY_CLASS = "flex flex-col gap-6";

// ─── Native ───────────────────────────────────────────────────────────────────

/**
 * The native price line.
 * The web lets a flex line align its items on their baseline; the platform lays a line of
 * text out the same way, so the two state the same arrangement.
 */
export const NATIVE_PRICING_PRICE_CLASS = "flex flex-row items-baseline gap-1";

/** The native list of features, which is a column whatever the window is. */
export const NATIVE_PRICING_FEATURES_CLASS = "flex flex-col gap-2";

/** One native feature line: a marker and the words, on one row. */
export const NATIVE_PRICING_FEATURE_CLASS = "flex flex-row items-start gap-2";

/** The native body arrangement of the card. */
export const NATIVE_PRICING_BODY_CLASS = "flex flex-col gap-6";

/**
 * The native badge above the plan name.
 * The web's badge is an inline element that shrinks to its words; a platform view fills
 * the row it is in, so it states that it is only as wide as its content.
 */
export const NATIVE_PRICING_BADGE_CLASS =
  "self-start rounded-sm bg-primary/10 px-2 py-0.5";

/** The badge's words, which carry the accent colour the web's badge states. */
export const NATIVE_PRICING_BADGE_TEXT_CLASS = "text-primary";

/**
 * The mark of the recommended plan.
 *
 * The web draws a ring on top of the card's border. The platform's card states its accent
 * as a border colour rather than as a ring, so the mark is the card's own `color` — the
 * accent the rest of the framework's surfaces use — and the class here states what the
 * platform keeps of the web's treatment.
 */
export const NATIVE_PRICING_HIGHLIGHTED_CLASS = "border-primary";

/** The native marker of an included feature, which is a character rather than a drawing. */
export const NATIVE_PRICING_FEATURE_MARKER_CLASS = "mt-1 shrink-0";

/** The accent an included feature's marker carries. */
export const NATIVE_PRICING_FEATURE_INCLUDED_CLASS = "text-success";

/** The muting an excluded feature's marker carries. */
export const NATIVE_PRICING_FEATURE_EXCLUDED_CLASS = "text-foreground/40";

/**
 * The marker of an included feature.
 * This package ships no icon set, so the framework's tick stands in for the web's check
 * drawing, exactly as it does in the stepper, the picker and the copy control.
 */
export const NATIVE_PRICING_INCLUDED_GLYPH = "✓";

/**
 * The marker of an excluded feature.
 * It is the dismissal glyph the framework's native components already draw with, which is
 * the same shape the web's close drawing has.
 */
export const NATIVE_PRICING_EXCLUDED_GLYPH = "✕";
