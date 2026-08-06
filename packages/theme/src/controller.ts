import type { ThemeName } from "@ashee/config";

export type ThemeSelection = ThemeName | "system";

const STORAGE_KEY = "ashee-theme";
const SYSTEM_DARK_QUERY = "(prefers-color-scheme: dark)";

type Listener = () => void;

class ThemeController {
  private selection: ThemeSelection = "light";
  private resolved: ThemeName = "light";
  private appliedClass: string | null = null;
  private listeners = new Set<Listener>();
  private mediaQuery: MediaQueryList | null = null;

  constructor() {
    if (typeof window === "undefined") return;

    this.mediaQuery = window.matchMedia(SYSTEM_DARK_QUERY);
    this.mediaQuery.addEventListener("change", this.handleSystemChange);

    const stored = window.localStorage.getItem(
      STORAGE_KEY,
    ) as ThemeSelection | null;
    this.selection = stored ?? "light";
    this.applySelection();
  }

  getSelection = (): ThemeSelection => this.selection;
  getResolvedTheme = (): ThemeName => this.resolved;

  /** Seeds the initial selection from config, but never overrides an explicit user choice already in storage. */
  setDefault = (theme: ThemeSelection): void => {
    if (
      typeof window !== "undefined" &&
      window.localStorage.getItem(STORAGE_KEY)
    )
      return;
    this.setTheme(theme);
  };

  setTheme = (selection: ThemeSelection): void => {
    this.selection = selection;
    if (typeof window !== "undefined")
      window.localStorage.setItem(STORAGE_KEY, selection);
    this.applySelection();
    this.listeners.forEach((l) => {
      l();
    });
  };

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private handleSystemChange = (): void => {
    if (this.selection !== "system") return;
    this.applySelection();
    this.listeners.forEach((l) => {
      l();
    });
  };

  private resolve(selection: ThemeSelection): ThemeName {
    if (selection !== "system") return selection;
    return this.mediaQuery?.matches ? "dark" : "light";
  }

  private applySelection(): void {
    this.resolved = this.resolve(this.selection);
    if (typeof document === "undefined") return;
    const cls = `theme-${this.resolved}`;
    if (this.appliedClass)
      document.documentElement.classList.remove(this.appliedClass);
    document.documentElement.classList.add(cls);
    this.appliedClass = cls;
  }
}

export const themeController = new ThemeController();
