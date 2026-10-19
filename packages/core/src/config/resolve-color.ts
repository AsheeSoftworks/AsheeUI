/**
 * Color configuration resolution utility for AsheeUI.
 * This file provides the resolveColorConfig function that merges user-provided
 * color configurations with the default color configuration. It handles both
 * built-in theme overrides and custom theme definitions, including theme
 * inheritance via the "extends" property.
 */

import type {
  ColorConfig,
  ColorVariant,
  DefaultColorConfig,
  ExternalColorConfig,
  ExternalColorVariant,
  KnownThemeName,
  ThemeName,
} from "../theme/color";

/**
 * Resolves the final color configuration by merging user-provided
 * external color config with the default color config.
 *
 * For built-in themes (light/dark), user overrides are merged on top
 * of the default theme values. For custom themes, the function looks
 * for an "extends" property to determine which theme to base the custom
 * theme on, falling back to `inheritFrom` and then to "light".
 *
 * The built-in themes are merged **first**, and a custom theme inherits from
 * the merged result, so a custom theme that extends `dark` inherits the
 * consumer's `dark` overrides rather than the library's original palette.
 *
 * @param defaults - The default color configuration with built-in themes.
 * @param external - Optional user-provided external color configuration.
 * @param inheritFrom - The theme a custom theme extends when it states no
 *   `extends`. Defaults to "light".
 * @returns The resolved color configuration with all themes fully defined.
 *
 * @example
 * ```tsx
 * const defaultColors = { light: {...}, dark: {...} };
 * const external = {
 *   light: { background: '#f0f0f0' },
 *   custom: { extends: 'dark', primary: '#ff6b6b' }
 * };
 * const result = resolveColorConfig(defaultColors, external);
 * // result.light.background is '#f0f0f0'
 * // result.custom is based on dark theme with #ff6b6b primary
 * ```
 */
export function resolveColorConfig(
  defaults: DefaultColorConfig,
  external?: ExternalColorConfig,
  inheritFrom: KnownThemeName = "light",
): ColorConfig {
  const result = { ...defaults } as ColorConfig;
  if (!external) return result;

  const entries = Object.entries(external) as [
    ThemeName,
    ExternalColorConfig[keyof ExternalColorConfig],
  ][];

  // Built-in themes first: a custom theme may extend one, and it has to see the
  // consumer's overrides rather than the palette that shipped with the library.
  for (const [key, userValue] of entries) {
    if (key !== "light" && key !== "dark") continue;
    if (!userValue) continue;

    result[key] = {
      ...defaults[key],
      ...(userValue as Partial<ColorVariant>),
    };
  }

  for (const [key, userValue] of entries) {
    if (key === "light" || key === "dark") continue;
    if (!userValue) continue;

    const { extends: baseName, ...overrides } =
      userValue as ExternalColorVariant;
    const base = result[baseName ?? inheritFrom] ?? defaults.light;

    (result as Record<string, ColorVariant>)[key] = {
      ...base,
      ...overrides,
    };
  }

  return result;
}
