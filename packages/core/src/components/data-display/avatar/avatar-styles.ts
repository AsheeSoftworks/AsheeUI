/**
 * The Avatar's one shared decision: what its fallback wears.
 *
 * An avatar shows an entity, so its fallback is a filled accent surface rather than an outline or a
 * tint. That is a *variant* — one of the five words in the shared `Variant` union — rather than a
 * class string, and a word both renderers name belongs in the package both of them read; the
 * alternative is the platform's avatar importing the web's to learn it, which H14 forbids. The
 * platform states the same decision in its own strings, as `NATIVE_AVATAR_FALLBACK_CLASS` per colour
 * role.
 *
 * Everything else the Avatar renders is each renderer's, and has left core. The diameters, the
 * initials scale and the fallback surface are in `packages/web/src/styles/avatar.ts` and
 * `packages/native/src/styles/avatar.ts`. The diameter is where the platforms spell one idea
 * differently — the web's `size-*` shorthand against the platform's `h-* w-*` pair — which is
 * exactly why a class string cannot be shared.
 */

import type { Variant } from "../../../shared/variant";

/**
 * The variant the initials fall back to.
 * An avatar shows an entity, so its fallback is a filled accent surface rather
 * than an outline or a tint. It stays in core because it names a value of the
 * shared `Variant` union rather than a class string.
 */
export const AVATAR_FALLBACK_VARIANT: Variant = "solid";
