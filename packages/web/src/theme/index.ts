/**
 * The web theme entry.
 *
 * The colour configuration and its defaults are platform-neutral and live in
 * `@asheeui/core`. What stays here is what only a browser can do: the controller
 * that writes the theme class to the document root, remembers the selection in
 * `localStorage` and follows the system preference, plus the hook components
 * read it through.
 */

export * from "@asheeui/core";
export * from "./controller";
export * from "./useTheme";
