/**
 * Every class string the Navbar renders, for the web renderer, kept side by side so a change to the
 * bar's shape lands on the web at once. Every entry is a complete, static class string,
 * because both Tailwind and NativeWind compile the classes they can read in the source.
 *
 * The platform's half of this file — the `NATIVE_*` dictionaries — moved to
 * `@asheeui/native`; what is left here is the web renderer's own.
 */

// ─── Web ──────────────────────────────────────────────────────────────────────

/** The typographic treatment of a brand that is a link, on the web. */
export const NAVBAR_BRAND_TEXT_CLASS = "font-semibold text-foreground";

// ─── Native ───────────────────────────────────────────────────────────────────
