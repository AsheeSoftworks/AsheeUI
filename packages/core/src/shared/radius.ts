/**
 * The size and radius vocabulary, and the one rule both renderers apply to it.
 *
 * The scales themselves are declared once, in `../tokens`: the unions below are
 * derived from the `SIZE` and `RADIUS_STEP` token maps, and every `Record` keyed
 * by them fails to compile until it states a newly added token.
 *
 * What a platform *draws* with those unions is not here. `RADIUS_CLASS` is the web's and
 * `NATIVE_RADIUS_CLASS` is the platform's; both moved to the renderer that compiles them
 * (C2 and C1), because a class string is a decision about pixels the two platforms do not
 * share.
 *
 * `UnderlineRadius` is the one export here that is neither a type nor a drawing, and it stays:
 * it is a *rule* both renderers have to answer the same way — an underlined control has square
 * corners — and a rule kept in one renderer is a divergence waiting for the other one to be
 * written (H18). The web applies it today; the platform adopts it in the batch that gives its
 * controls a radius, which is a one-line change here rather than a second copy of the exception.
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
