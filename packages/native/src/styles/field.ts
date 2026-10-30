/**
 * The platform's class dictionaries for field.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/forms/field/field-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

/**
 * The stack a native shell's parts sit in.
 * The same gap as the web shell's, in the platform's own layout vocabulary.
 */
export const NATIVE_FIELD_SHELL_CLASS = "flex-col gap-1.5";

/**
 * The row a native field's label sits in.
 * Native draws the label's marker as its own text node rather than inside the label
 * string, which is why the row exists at all: the marker has to be able to be read
 * out of the accessibility tree without leaving the visual label.
 */
export const NATIVE_FIELD_LABEL_ROW_CLASS = "flex-row items-center gap-1";
