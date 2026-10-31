/**
 * The web adapter for the shared theme controller.
 *
 * The state machine lives in `@asheeui/core` (B11): one selection, one stored preference,
 * one set of six rules on both platforms. What is left here is what only a browser can do —
 * ask `matchMedia` what the operating system prefers, read and write `localStorage`, and
 * paint the resolved theme on the document root. Those four facts are the `ThemeHost` the
 * controller is created with; this module is the singleton an application shares.
 *
 * **The paint callback is the old `applySelection`'s DOM half, moved out of the state
 * machine.** It replaces any `theme-*` class already on the root — including the one the
 * pre-paint script wrote — and writes `color-scheme`, so the browser's own surfaces
 * (scrollbars, form controls, the caret) follow a theme changed after hydration. Moving it
 * here is what lets the controller be shared: core may not import a DOM.
 *
 * **Server rendering is safe.** `window` and `document` are checked at use rather than read
 * at module load, so importing this module where there is no browser creates a controller
 * that resolves `"system"` to light and paints nothing. The pre-paint script and the
 * provider's effect are what paint the first frame in a browser.
 */

import {
  createThemeController,
  THEME_CLASS_PREFIX,
  THEME_STORAGE_KEY,
} from "@asheeui/core";

/** The media query that states the browser's colour-scheme preference. */
const SYSTEM_DARK_QUERY = "(prefers-color-scheme: dark)";

/** Whether this module is running where a browser's APIs exist. */
function hasWindow(): boolean {
  return typeof window !== "undefined";
}

/**
 * The theme controller an application shares.
 *
 * Its host is the DOM: `matchMedia` for the platform's scheme, `localStorage` for the
 * stored selection, and the document root for painting. `useTheme`, the provider and the
 * pre-paint script all reach this one instance, which is what makes a choice in one place
 * visible everywhere.
 */
export const themeController = createThemeController({
  systemScheme: () =>
    hasWindow() && window.matchMedia(SYSTEM_DARK_QUERY).matches
      ? "dark"
      : "light",

  onSystemChange: (listener) => {
    if (!hasWindow()) return () => {};

    const query = window.matchMedia(SYSTEM_DARK_QUERY);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  },

  storage: {
    get: () => (hasWindow() ? window.localStorage.getItem(THEME_STORAGE_KEY) : null),
    set: (value) => {
      if (hasWindow()) window.localStorage.setItem(THEME_STORAGE_KEY, value);
    },
    remove: () => {
      if (hasWindow()) window.localStorage.removeItem(THEME_STORAGE_KEY);
    },
  },

  paint: (resolved) => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const themeClass = `${THEME_CLASS_PREFIX}${resolved}`;

    // Remove every theme class, not just the previous one: another script, a test or an
    // earlier render may have left more than one.
    for (const existing of Array.from(root.classList)) {
      if (existing.startsWith(THEME_CLASS_PREFIX)) {
        root.classList.remove(existing);
      }
    }
    root.classList.add(themeClass);

    // The pre-paint script writes this while the document is parsed; a theme switched after
    // that — and any client-only render, which never runs the script — has to write it too,
    // or the browser's own surfaces keep the replaced theme's scheme.
    root.style.colorScheme = resolved;
  },
});

/**
 * The selection type and the storage key are the platform-neutral ones.
 *
 * Re-exported here because this module published them before the state machine moved, and
 * a consumer importing them from the web theme entry keeps working.
 */
export { THEME_STORAGE_KEY, type ThemeSelection } from "@asheeui/core";

/** The shape a provider hands `configure`. */
export type { ThemeConfigInput } from "@asheeui/core";
