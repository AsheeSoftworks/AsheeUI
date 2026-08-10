import {
  applyThemeConfig,
  type ColorConfig,
  type ThemeSelection,
  themeController,
} from "@ashee/theme";
import { mergeObject } from "@ashee/utils";
import {
  defaultUserSettings,
  type ExternalUserSettings,
  type UserSettings,
} from "./types";

const STORAGE_KEY = "ashee-settings";
type Listener = () => void;

interface InitTheme {
  color: ColorConfig;
  defaultTheme?: ThemeSelection;
}

class SettingsController {
  private state: UserSettings = defaultUserSettings;
  private baseColors: ColorConfig | null = null;
  private hydrated = false;
  private listeners = new Set<Listener>();

  constructor() {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      this.state = mergeObject(
        defaultUserSettings,
        JSON.parse(stored) as ExternalUserSettings,
      );
      this.hydrated = true;
    } catch {
      // corrupted storage — fall back to defaults silently
    }
  }

  /** Called once by AsheeUIProvider with the resolved app config. */
  init(theme: InitTheme): void {
    this.baseColors = theme.color;
    if (!this.hydrated && theme.defaultTheme) {
      this.state = mergeObject(this.state, {
        theme: theme.defaultTheme,
      } as ExternalUserSettings);
    }
    this.applyAll();
  }

  getSettings = (): UserSettings => this.state;

  update = (patch: ExternalUserSettings): void => {
    this.state = mergeObject(this.state, patch);
    this.persist();
    this.applyAll();
    this.listeners.forEach((l) => {
      l();
    });
  };

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private applyAll() {
    if (!this.baseColors) return;
    themeController.setTheme(this.state.theme);
    const colors = this.state.customColors
      ? mergeObject(this.baseColors, this.state.customColors)
      : this.baseColors;
    applyThemeConfig(colors);
    this.applyFontScale();
    this.applyAnimations();
  }

  private applyFontScale() {
    if (typeof document === "undefined") return;
    document.documentElement.style.setProperty(
      "--ashee-font-scale",
      String(this.state.fontScale),
    );
  }

  private applyAnimations() {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle(
      "ashee-no-animations",
      !this.state.enableAnimations,
    );
  }

  private persist() {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }
}

export const settingsController = new SettingsController();
