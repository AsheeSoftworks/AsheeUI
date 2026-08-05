import type { ThemeName } from "@ashee/config";

const CLASSES: `theme-${ThemeName}`[] = [
  "theme-light",
  "theme-dark",
  "theme-white",
  "theme-black",
];
const STORAGE_KEY = "ashee-theme";

type Listener = () => void;

class ThemeController {
  private current: ThemeName = "light";
  private listeners = new Set<Listener>();

  constructor() {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(
        STORAGE_KEY,
      ) as ThemeName | null;
      if (stored) this.current = stored;
      this.applyToDom(this.current);
    }
  }

  getTheme = (): ThemeName => this.current;

  setTheme = (theme: ThemeName): void => {
    this.current = theme;
    this.applyToDom(theme);
    if (typeof window !== "undefined")
      window.localStorage.setItem(STORAGE_KEY, theme);
    this.listeners.forEach((l) => {
      l();
    });
  };

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private applyToDom(theme: ThemeName) {
    if (typeof document === "undefined") return;
    document.documentElement.classList.remove(...CLASSES);
    document.documentElement.classList.add(`theme-${theme}`);
  }
}

export const themeController = new ThemeController();
