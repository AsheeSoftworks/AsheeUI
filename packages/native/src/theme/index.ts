/**
 * The native theme entry.
 *
 * The colour configuration, its defaults and the theme state machine are core's. What is
 * here is the platform's host — `Appearance`, the injected storage and the provider's
 * repaint — and the hook components read it through, which are the same names the web
 * publishes.
 */

export * from "./controller";
export * from "./palette";
export * from "./useTheme";
