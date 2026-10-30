/**
 * Size and radius type definitions for AsheeUI components.
 * This file defines the common size and radius types used across the component
 * library, along with utility functions for applying radius styles based on
 * component variants and states.
 *
 * The scales themselves are declared once, in `../tokens`: the unions below are
 * derived from the `SIZE` and `RADIUS_STEP` token maps, and every `Record` keyed
 * by them fails to compile until it states a newly added token.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { Radius, Size } from "../tokens";
import type { Variant } from "./";

/**
 * The available size and radius options for components.
 *
 * `Size` is derived from the `SIZE` map in `../tokens` ("sm" is small, "md" is
 * medium and the default, "lg" is large). `Radius` is derived from the
 * `RADIUS_STEP` map there and runs from "none" (square corners) to "full"
 * (circular or pill shapes).
 */
export type { Radius, Size };

/**
 * Determines the appropriate radius to apply based on the component variant.
 * For underlined variants, the radius is forced to "none" because underlined
 * elements should not have rounded corners. For all other variants, the
 * provided radius is returned unchanged.
 *
 * @param variant - The component variant to check.
 * @param radius - The preferred radius value.
 * @returns The resolved radius, which will be "none" for underlined variants.
 *
 * @example
 * ```tsx
 * const radius = UnderlineRadius('underlined', 'lg');
 * // Returns "none" because underlined variants should not have rounded corners
 * ```
 *
 * @example
 * ```tsx
 * const radius = UnderlineRadius('solid', 'lg');
 * // Returns "lg" because solid variants can use the preferred radius
 * ```
 */
export const UnderlineRadius = (variant: Variant, radius: Radius): Radius => {
  if (variant === "underlined") {
    return "none";
  }
  return radius;
};
