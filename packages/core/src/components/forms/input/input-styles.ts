/**
 * The Input's class dictionaries.
 *
 * The web entries are Tailwind classes and the native entries are NativeWind ones.
 * They differ in more than spelling, and deliberately: the web field fixes an
 * explicit height because its text is measured in `rem`, while a native field states
 * a *minimum* height because a control a thumb cannot reach is a defect rather than a
 * style choice, and it lets the platform's own text metrics size the rest.
 *
 * Corner rounding is not mapped here on either platform. A radius is the platform's
 * vocabulary rather than a component's, so a renderer that rounds reads the shared
 * radius map instead of restating the scale — which is what keeps a field, a button
 * and a badge in the same corner.
 *
 * The status edge is not mapped here either: an input is a field, so the edge its
 * validation decides is the family's `FIELD_STATUS_BORDER_CLASS`, stated once.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { Size } from "../../../shared/radius";

// ─── Web ──────────────────────────────────────────────────────────────────────

/**
 * Height, padding and text size for each density.
 * The web states a height rather than a minimum, since its scale is fixed by the
 * stylesheet rather than by the platform's font metrics.
 */
export const INPUT_SIZE_CLASS: Record<Size, string> = {
  sm: "h-8 px-2.5 text-xs",
  md: "h-10 px-3 text-sm",
  lg: "h-12 px-4 text-base",
};

// ─── Native ───────────────────────────────────────────────────────────────────
