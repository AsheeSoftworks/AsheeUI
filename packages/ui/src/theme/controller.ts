import type { ThemeName } from "./color";

export type ThemeSelection = ThemeName | "system";

export const THEME_STORAGE_KEY = "ashee-theme";
const SYSTEM_DARK_QUERY = "(prefers-color-scheme: dark)";
const THEME_CLASS_PREFIX = "theme-";

type Listener = () => void;

export interface ThemeConfigInput {
  defaultTheme: ThemeSelection;
  themes: readonly string[];
}

class ThemeController {
  private selection: ThemeSelection = "light";
  private resolved: ThemeName = "light";
  private defaultTheme: ThemeSelection = "light";
  private availableThemes: readonly string[] = [];
  private listeners = new Set<Listener>();
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
    console.log("[Theme] configure called with:", { defaultTheme, themes });
    this.defaultTheme = defaultTheme;
    this.availableThemes = themes;

    if (typeof window === "undefined") {
      console.log(
        "[Theme] Running in non-browser environment, skipping localStorage operations.",
      );
      return;
    }

    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    console.log("[Theme] Retrieved from localStorage:", stored);

    const hasValidStored =
      stored !== null && this.isValid(stored as ThemeSelection);
    console.log("[Theme] Is stored theme valid?", hasValidStored);

    if (!hasValidStored) {
      if (stored !== null) {
        console.log(
          "[Theme] Invalid stored theme, removing from localStorage.",
        );
        window.localStorage.removeItem(THEME_STORAGE_KEY);
      }
    }

    this.selection = hasValidStored ? (stored as ThemeSelection) : defaultTheme;
    console.log("[Theme] Final selection:", this.selection);

    this.applySelection();
    console.log("[Theme] Applied selection.");

    this.listeners.forEach((l) => {
      l();
    });
    console.log("[Theme] Notified all listeners.");
  }

  /**
   * Seeds the default theme. Kept for backward compatibility - prefer
   * `configure()`, which also validates the stored selection against the
   * available theme map.
   */
  setDefault = (theme: ThemeSelection): void => {
    this.configure({ defaultTheme: theme, themes: this.availableThemes });
  };

  getSelection = (): ThemeSelection => this.selection;
  getResolvedTheme = (): ThemeName => this.resolved;

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

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getAvailableThemes = (): readonly string[] => this.availableThemes;

  /**
   * Cycles to the next theme in sequence (including "system" mode by default).
   * Loops back to the start when reaching the end of the available themes list.
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

  private handleSystemChange = (): void => {
    if (this.selection !== "system") return;
    this.applySelection();
    this.listeners.forEach((l) => {
      l();
    });
  };

  private sanitize(selection: ThemeSelection): ThemeSelection {
    if (this.isValid(selection)) return selection;
    return this.defaultTheme;
  }

  private isValid(selection: ThemeSelection): boolean {
    if (selection === "system") return true;
    if (this.availableThemes.length > 0)
      return this.availableThemes.includes(selection);
    return true;
  }

  private resolve(selection: ThemeSelection): ThemeName {
    if (selection !== "system") return selection as ThemeName;
    return this.mediaQuery?.matches ? "dark" : "light";
  }

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

export const themeController = new ThemeController();
