/**
 * The Link's class dictionaries, for the web renderer.
 *
 * A link's scale is the framework's typography and spacing, so both renderers compile
 * the same size and spacing utilities; what each renderer has to say for itself is what
 * it does with an interaction. The web reveals an underline while a pointer rests on the
 * link, and the platform reveals it while the link is pressed, because there is no
 * pointer to rest anywhere — which is why the underline map is a map per renderer rather
 * than one map both read.
 *
 * Every entry is a complete, static class string: Tailwind on the web and NativeWind on
 * native both compile the classes they can read in the source. An unprefixed `LINK_*`
 * constant is the web renderer's; `NATIVE_LINK_*` is the native renderer's.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

import type { Size } from "../../../shared/radius";

/** Font size and the gap beside the icons, at each density. */
export const LINK_SIZE_CLASS: Record<Size, string> = {
  sm: "text-xs gap-1.5",
  md: "text-sm gap-2",
  lg: "text-base gap-2.5",
};

// ─── Native ───────────────────────────────────────────────────────────────────
