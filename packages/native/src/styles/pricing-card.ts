/**
 * The platform's class dictionaries for pricing-card.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/marketing/pricing-card/pricing-card-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

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
