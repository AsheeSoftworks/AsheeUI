/**
 * The platform's class dictionaries for skeleton.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/feedback/skeleton/skeleton-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

/**
 * Base classes for the native placeholder surface.
 *
 * The colour is the same token the web uses, so a placeholder is the same weight
 * of grey on both platforms. There is no animation class: the pulse is an
 * `Animated` value the component drives, which is the platform's own mechanism and
 * the only one that runs there.
 */
export const NATIVE_SKELETON_BASE_CLASS = "bg-secondary/60 overflow-hidden";
