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
  KnownThemeName,
} from "../theme/color";

/**
 * Whether a theme name is one of the built-in themes.
 *
 * @param name - The theme name to test.
 * @returns `true` for `light` and `dark`.
 */
function isBuiltIn(name: string): name is KnownThemeName {
  return name === "light" || name === "dark";
}

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
 * A custom theme may also extend another custom theme, in any declaration order.
 * The palettes are resolved as a dependency graph rather than in insertion order, so a
 * theme that names one declared *later* in the same `color` object inherits it instead of
 * silently receiving the library's light palette. A cycle (`a extends b`, `b extends a`)
 * has no base to inherit, so each theme in it starts from `inheritFrom`, and the resolution
 * terminates instead of recursing forever.
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

  // Built-in themes first: a custom theme may extend one, and it has to see the
  // consumer's overrides rather than the palette that shipped with the library.
  for (const name of Object.keys(defaults) as KnownThemeName[]) {
    const overrides = external[name];
    if (!overrides) continue;

    result[name] = {
      ...defaults[name],
      ...overrides,
    };
  }

  const customNames = Object.keys(external).filter(
    (name) => !isBuiltIn(name) && Boolean(external[name]),
  );
  const customThemes = new Set(customNames);

  /** The palette a custom theme starts from when nothing else is named. */
  const inheritBase = (): ColorVariant => result[inheritFrom] ?? defaults.light;

  /** Palettes already resolved, keyed by theme name. */
  const resolved = new Map<string, ColorVariant>();

  /** Themes on the current resolution path, so a cycle is detected rather than followed. */
  const resolving = new Set<string>();

  /**
   * Resolve one custom theme, resolving the theme it extends first.
   *
   * @param name - The custom theme to resolve.
   * @returns The fully resolved palette for `name`.
   */
  const resolveTheme = (name: string): ColorVariant => {
    const done = resolved.get(name);
    if (done) return done;

    const { extends: declaredBase, ...overrides } = external[name];

    let base: ColorVariant;
    if (declaredBase === undefined) {
      base = inheritBase();
    } else if (resolving.has(declaredBase)) {
      // A cycle: `name` is already being resolved further up the chain, so following it
      // again would never reach a base. The application's default family is where an
      // unstated `extends` starts, so it is where a circle starts too.
      base = inheritBase();
    } else if (customThemes.has(declaredBase)) {
      // The theme being extended is another custom theme. It may be declared later in the
      // object, so it is resolved here rather than read from a partly filled result —
      // reading it in insertion order is what made a forward reference fall back to light.
      resolving.add(name);
      base = resolveTheme(declaredBase);
      resolving.delete(name);
    } else {
      // A name that is neither built in nor declared: the historical fallback.
      base = result[declaredBase] ?? defaults.light;
    }

    const palette = { ...base, ...overrides };
    resolved.set(name, palette);
    return palette;
  };

  // Assign in declaration order, so the generated CSS keeps the order the consumer wrote
  // even though the palettes are resolved in dependency order.
  for (const name of customNames) {
    (result as Record<string, ColorVariant>)[name] = resolveTheme(name);
  }

  return result;
}
