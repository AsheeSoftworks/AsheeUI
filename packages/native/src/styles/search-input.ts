/**
 * The platform's class dictionaries for search-input.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/forms/search-input/search-input-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

/** The search region: the row the field and its controls sit in. */
export const NATIVE_SEARCH_INPUT_ROW_CLASS =
  "flex-row items-center gap-2 w-full min-w-0";

/** The field itself, which takes whatever room the controls beside it leave. */
export const NATIVE_SEARCH_INPUT_FIELD_CLASS = "flex-1 min-w-0";

/**
 * The control that empties the field.
 *
 * It is a pressable box rather than a glyph alone, because a control a thumb cannot hit is
 * a defect rather than a style choice; the platform's minimum touch target is what the
 * padding states.
 */
export const NATIVE_SEARCH_INPUT_CLEAR_CLASS =
  "shrink-0 items-center justify-center px-2 py-1";

/** The glyph the control draws, which is stated in the field's own colour role. */
export const NATIVE_SEARCH_INPUT_CLEAR_GLYPH_CLASS = "text-foreground/60";
