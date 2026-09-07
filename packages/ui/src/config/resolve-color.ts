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
  ThemeName,
} from "../theme/color";

/**
 * Resolves the final color configuration by merging user-provided
 * external color config with the default color config.
 *
 * For built-in themes (light/dark), user overrides are merged on top
 * of the default theme values. For custom themes, the function looks
 * for an "extends" property to determine which built-in theme to base
 * the custom theme on, falling back to "light" if not specified.
 *
 * @param defaults - The default color configuration with built-in themes.
 * @param external - Optional user-provided external color configuration.
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
): ColorConfig {
  const result = { ...defaults } as ColorConfig;
  if (!external) return result;

  for (const key of Object.keys(external) as ThemeName[]) {
    const userValue = external[key as keyof ExternalColorConfig];
    if (!userValue) continue;

    if (key === "light" || key === "dark") {
      // known themes always fall back to their own defaults, never "extends"
      result[key] = {
        ...defaults[key],
        ...(userValue as Partial<ColorVariant>),
      };
      continue;
    }

    const { extends: baseName, ...overrides } =
      userValue as ExternalColorVariant;
    const base = defaults[baseName ?? "light"];
    (result as Record<string, ColorVariant>)[key] = {
      ...base,
      ...overrides,
    };
  }

  return result;
}
