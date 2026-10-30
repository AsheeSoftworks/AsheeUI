/**
 * The platform's class dictionaries for visually-hidden.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/shared/visually-hidden.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

/**
 * Text that is announced but not shown, on the platform.
 */
export const NATIVE_VISUALLY_HIDDEN_CLASS = "absolute w-px h-px opacity-0";
