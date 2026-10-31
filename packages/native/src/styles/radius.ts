/**
 * The platform's class dictionaries for radius.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/shared/radius.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { Radius } from "@asheeui/core";

/**
 * The native renderer's radius vocabulary.
 *
 * The two platforms compile the same `rounded-*` names, but the scale's first two
 * steps do not line up: the web map follows Tailwind v4, where `rounded-xs` is the
 * smallest corner and `rounded-sm` the next, and the native map keeps the earlier
 * spelling the native renderer has always shipped, where `rounded-sm` is the
 * smallest and `rounded` the next. Native therefore cannot be handed `RADIUS_CLASS`
 * without its corners moving.
 *
 * The map lives here rather than in the component that reads it because it is the
 * platform's vocabulary rather than the component's: every native surface that
 * rounds reads this one map, so a change to the native scale is one edit. Aligning
 * the two vocabularies is a change to how a native surface rounds rather than a
 * detail of this module, so it is a design-language decision and not a refactor.
 */
export const NATIVE_RADIUS_CLASS: Record<Radius, string> = {
  none: "rounded-none",
  xs: "rounded-sm",
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};
