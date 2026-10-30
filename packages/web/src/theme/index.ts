/**
 * The web theme entry.
 *
 * The colour configuration, its defaults and the theme state machine are platform-neutral
 * and live in `@asheeui/core`. What stays here is what only a browser can do: the controller
 * host that writes the theme class to the document root, remembers the selection in
 * `localStorage` and follows the system preference, plus the hook components read it
 * through.
 */

export * from "@asheeui/core";
export * from "./controller";
export * from "./useTheme";

/**
 * The names both branches publish, stated explicitly.
 *
 * `@asheeui/core` exports them too, and two `export *` sources for one name would make the
 * name ambiguous. An explicit export resolves it to the binding the controller itself
 * re-exports, which is core's — the same value a device reads.
 */
export { THEME_STORAGE_KEY } from "./controller";
export type { ThemeConfigInput, ThemeSelection } from "./controller";
