/**
 * The application's runtime theme state, shared by the two shells.
 *
 * A shell owns the state and its persistence (localStorage on the web, AsyncStorage on a device)
 * and passes it to `AsheeUIProvider`. The shared settings screen reads the same state through this
 * context, so it can edit themes without importing a platform storage module or knowing which shell
 * mounted it.
 */
import type { ExternalConfig } from "asheeui";
import { validateRuntimeThemes } from "@asheeui/core";
import {
  createContext,
  type ReactNode,
  useContext,
} from "react";

/** The storage key both shells use for the runtime definitions. */
export const THEME_DEFINITIONS_KEY = "pulse.themes";

/** The runtime theme map an application passes to `AsheeUIProvider themes`. */
export type AppThemes = NonNullable<ExternalConfig["color"]>;

export interface ThemeSettingsValue {
  /** The runtime definitions currently active. */
  themes: AppThemes;

  /** Replace the map; the shell persists it and gives it to the provider. */
  onChange(themes: AppThemes): void;
}

const ThemeSettingsContext = createContext<ThemeSettingsValue | null>(null);

export interface ThemeSettingsProviderProps extends ThemeSettingsValue {
  children: ReactNode;
}

/**
 * Make the shell's theme state available to the shared screens.
 *
 * @param props - The current map, its setter and the subtree.
 */
export function ThemeSettingsProvider({
  themes,
  onChange,
  children,
}: ThemeSettingsProviderProps) {
  return (
    <ThemeSettingsContext.Provider value={{ themes, onChange }}>
      {children}
    </ThemeSettingsContext.Provider>
  );
}

/**
 * Read the shell's runtime theme state.
 *
 * @returns The current map and its setter.
 * @throws When used outside {@link ThemeSettingsProvider}.
 */
export function useThemeSettings(): ThemeSettingsValue {
  const value = useContext(ThemeSettingsContext);
  if (!value) {
    throw new Error(
      "useThemeSettings must be used within ThemeSettingsProvider - wrap the shell's provider with it.",
    );
  }
  return value;
}

/**
 * Validate a value read from storage before it reaches the provider.
 *
 * A stored definition is application data rather than a compile-time literal: a bad edit, an older
 * version or a hand-written localStorage entry must not make the provider throw during render. An
 * invalid map is discarded as a whole, which leaves the built-ins and the configured themes intact.
 *
 * @param value - The parsed JSON value, or `null` when the key is absent.
 * @param config - The application's static configuration, so an `extends` may name its themes.
 * @returns A valid map, or `{}` when the value is not acceptable.
 */
export function parseStoredThemes(
  value: unknown,
  config: ExternalConfig,
): AppThemes {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return {};
  }

  const themes = value as AppThemes;
  return validateRuntimeThemes(themes, config).length === 0 ? themes : {};
}
