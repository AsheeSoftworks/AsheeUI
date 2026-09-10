/**
 * Color theme type definitions for AsheeUI.
 * This file defines the core color system types, including theme names,
 * color variant structures, and configuration types for both built-in
 * and custom themes. It sits at the foundation of the theming system
 * and is consumed by the theme controller and color utilities.
 */

import type { ThemeName } from "./color";

/**
 * A theme selection that can be either a specific theme name or the special
 * "system" value, which resolves to either light or dark based on the user's
 * system preference.
 */
export type ThemeSelection = ThemeName | "system";

/**
 * Local storage key used to persist the user's theme preference.
 */
export const THEME_STORAGE_KEY = "ashee-theme";

/**
 * Media query string for detecting system dark mode preference.
 */
const SYSTEM_DARK_QUERY = "(prefers-color-scheme: dark)";

/**
 * Prefix applied to CSS classes that represent theme states.
 * For example, a resolved theme of "light" becomes "theme-light".
 */
const THEME_CLASS_PREFIX = "theme-";

/**
 * Function type for theme change listeners.
 */
type Listener = () => void;

/**
 * Input configuration required to initialize the theme controller.
 * Provides the default theme and the list of available themes.
 */
export interface ThemeConfigInput {
  /**
   * The default theme to use when no user preference is stored or when
   * the stored preference is invalid. This can be a specific theme name
   * or "system" to follow the system preference.
   */
  defaultTheme: ThemeSelection;

  /**
   * The list of theme names that are available in the application.
   * This is used to validate stored preferences and to determine
   * which themes can be toggled through the toggleTheme method.
   */
  themes: readonly string[];
}

/**
 * Manages theme state, persistence, and system preference detection.
 * This class handles the core logic of selecting, resolving, and applying
 * themes, including storing preferences in localStorage and responding to
 * system dark mode changes. It follows the observer pattern to notify
 * subscribers when the theme changes.
 */
class ThemeController {
  /**
   * The user's selected theme preference, which may be "system"
   * or a specific theme name.
   */
  private selection: ThemeSelection = "light";

  /**
   * The final resolved theme name after applying the selection
   * and resolving "system" to either "light" or "dark".
   */
  private resolved: ThemeName = "light";

  /**
   * The default theme configured when the controller was initialized.
   * Used as a fallback when the stored preference is invalid.
   */
  private defaultTheme: ThemeSelection = "light";

  /**
   * The list of available themes in the application.
   * Used for validation and cycling through themes.
   */
  private availableThemes: readonly string[] = [];

  /**
   * Set of listener functions that are called when the theme changes.
   */
  private listeners = new Set<Listener>();

  /**
   * MediaQueryList for detecting system dark mode preference.
   * Null when running in a non-browser environment.
   */
  private mediaQuery: MediaQueryList | null = null;

  constructor() {
    if (typeof window === "undefined") return;

    this.mediaQuery = window.matchMedia(SYSTEM_DARK_QUERY);
    this.mediaQuery.addEventListener("change", this.handleSystemChange);
  }

  /**
   * Seeds the controller with the resolved theme config and applies the theme.
   *
   * - Uses `localStorage["ashee-theme"]` when it holds a valid selection.
   * - Falls back to `config.theme.defaultTheme` on first visit.
   * - Clears stale/invalid values from storage.
   * - Never writes to storage (only `setTheme` persists user intent).
   */
  configure({ defaultTheme, themes }: ThemeConfigInput): void {
    this.defaultTheme = defaultTheme;
    this.availableThemes = themes;

    if (typeof window === "undefined") {
      console.log(
        "[Theme] Running in non-browser environment, skipping localStorage operations.",
      );
      return;
    }

    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

    const hasValidStored =
      stored !== null && this.isValid(stored as ThemeSelection);

    if (!hasValidStored) {
      if (stored !== null) {
        console.log(
          "[Theme] Invalid stored theme, removing from localStorage.",
        );
        window.localStorage.removeItem(THEME_STORAGE_KEY);
      }
    }

    this.selection = hasValidStored ? (stored as ThemeSelection) : defaultTheme;

    this.applySelection();

    this.listeners.forEach((l) => {
      l();
    });
  }

  /**
   * Seeds the default theme. Kept for backward compatibility - prefer
   * `configure()`, which also validates the stored selection against the
   * available theme map.
   *
   * @deprecated Use `configure()` instead for complete initialization.
   */
  setDefault = (theme: ThemeSelection): void => {
    this.configure({ defaultTheme: theme, themes: this.availableThemes });
  };

  /**
   * Returns the current theme selection.
   * @returns The current selected theme, which may be "system" or a specific theme name.
   */
  getSelection = (): ThemeSelection => this.selection;

  /**
   * Returns the resolved theme name after applying the selection.
   * If the selection is "system", this will resolve to either "light" or "dark"
   * based on the system preference.
   * @returns The resolved theme name.
   */
  getResolvedTheme = (): ThemeName => this.resolved;

  /**
   * Sets the theme selection and persists it to localStorage.
   * The provided selection is validated and sanitized before applying.
   * @param selection - The theme to select, either "system" or a theme name.
   */
  setTheme = (selection: ThemeSelection): void => {
    const sanitized = this.sanitize(selection);
    this.selection = sanitized;
    if (typeof window !== "undefined")
      window.localStorage.setItem(THEME_STORAGE_KEY, sanitized);
    this.applySelection();
    this.listeners.forEach((l) => {
      l();
    });
  };

  /**
   * Subscribes a listener to theme changes.
   * The listener will be called whenever the theme selection or resolved theme changes.
   * @param listener - The function to call when the theme changes.
   * @returns An unsubscribe function that removes the listener.
   */
  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  /**
   * Returns the list of available theme names.
   * @returns The list of available themes configured in the controller.
   */
  getAvailableThemes = (): readonly string[] => this.availableThemes;

  /**
   * Cycles to the next theme in sequence (including "system" mode by default).
   * Loops back to the start when reaching the end of the available themes list.
   * The "system" option is not included in the toggle sequence; only specific
   * theme names are cycled through.
   */
  toggleTheme = (): void => {
    // Deduplicate and filter available themes
    const uniqueThemes = Array.from(new Set(this.availableThemes)).filter(
      (t) => t !== "system",
    ) as ThemeSelection[];

    const currentIndex = uniqueThemes.indexOf(this.selection);
    const nextIndex =
      currentIndex === -1 ? 0 : (currentIndex + 1) % uniqueThemes.length;

    this.setTheme(uniqueThemes[nextIndex]);
  };

  /**
   * Handles system dark mode preference changes.
   * Only re-applies the theme if the current selection is "system",
   * ensuring the resolved theme stays in sync with system changes.
   */
  private handleSystemChange = (): void => {
    if (this.selection !== "system") return;
    this.applySelection();
    this.listeners.forEach((l) => {
      l();
    });
  };

  /**
   * Validates a theme selection and returns a valid fallback if necessary.
   * @param selection - The theme selection to sanitize.
   * @returns A valid theme selection, falling back to the default theme
   *          if the provided selection is invalid.
   */
  private sanitize(selection: ThemeSelection): ThemeSelection {
    if (this.isValid(selection)) return selection;
    return this.defaultTheme;
  }

  /**
   * Checks whether a theme selection is valid.
   * "system" is always valid. Other theme names are valid if they exist
   * in the available themes list. If no available themes are configured,
   * any selection is considered valid.
   * @param selection - The theme selection to validate.
   * @returns True if the selection is valid, false otherwise.
   */
  private isValid(selection: ThemeSelection): boolean {
    if (selection === "system") return true;
    if (this.availableThemes.length > 0)
      return this.availableThemes.includes(selection);
    return true;
  }

  /**
   * Resolves a theme selection to an actual theme name.
   * If the selection is "system", resolves based on the system preference.
   * @param selection - The theme selection to resolve.
   * @returns The resolved theme name.
   */
  private resolve(selection: ThemeSelection): ThemeName {
    if (selection !== "system") return selection as ThemeName;
    return this.mediaQuery?.matches ? "dark" : "light";
  }

  /**
   * Applies the current theme selection by updating the DOM.
   * This method sanitizes the selection, resolves it to a theme name,
   * and applies the appropriate CSS class to the document root.
   * It ensures that only valid theme classes are applied and removes
   * any previously applied theme classes.
   */
  private applySelection(): void {
    const selection = this.sanitize(this.selection);
    let resolved: ThemeName = this.resolve(selection);

    // Guard: never apply a theme class that has no generated CSS block.
    if (
      this.availableThemes.length > 0 &&
      !this.availableThemes.includes(resolved)
    ) {
      resolved = (
        this.availableThemes.includes(this.defaultTheme)
          ? this.defaultTheme
          : this.availableThemes[0]
      ) as ThemeName;
    }

    this.resolved = resolved;
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const cls = `${THEME_CLASS_PREFIX}${resolved}`;

    // Remove any previously applied ashee theme class - including the one
    // added by the pre-paint FOUC script in <head>.
    for (const existing of Array.from(root.classList)) {
      if (existing.startsWith(THEME_CLASS_PREFIX)) {
        root.classList.remove(existing);
      }
    }
    root.classList.add(cls);
  }
}

/**
 * Singleton instance of the theme controller.
 * This instance manages the global theme state and should be used
 * throughout the application for theme operations.
 */
export const themeController = new ThemeController();
