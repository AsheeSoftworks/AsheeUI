/**
 * Pre-paint theme script for AsheeUI.
 * This file provides the AsheeThemeScript component that injects CSS variables
 * and applies the correct theme class synchronously before the initial paint.
 * This prevents Flash of Unstyled Content (FOUC) by ensuring the theme is
 * applied before any content is rendered. The script runs during SSR and
 * client-side hydration, using the resolved configuration from the provider.
 */

import type { Config } from "../config/config";
import type { ColorConfig, ColorVariant } from "../theme/color";
import { THEME_STORAGE_KEY } from "../theme/controller";

/**
 * Mapping from color variant property names to CSS custom property names.
 * These variables are used throughout the component library to apply
 * theme colors consistently.
 */
const VAR_MAP: Record<keyof ColorVariant, string> = {
  background: "--ashee-background",
  foreground: "--ashee-foreground",
  primary: "--ashee-primary",
  secondary: "--ashee-secondary",
  border: "--ashee-border",
  danger: "--ashee-danger",
  warning: "--ashee-warning",
  success: "--ashee-success",
  scrollbarThumb: "--ashee-scrollbar-thumb",
  scrollbarTrack: "--ashee-scrollbar-track",
};

/**
 * The ID used for the style element that contains theme CSS variables.
 * This allows the script to check for and reuse existing style elements.
 */
export const THEME_VARS_STYLE_ID = "ashee-theme-vars";

/**
 * Builds CSS string for all theme color variables.
 * Generates CSS rules that define CSS custom properties for each theme.
 * The light theme uses both :root and .theme-light selectors for compatibility.
 *
 * @param colors - The complete color configuration with all themes.
 * @returns A CSS string containing variable declarations for all themes.
 *
 * @example
 * ```tsx
 * const css = buildThemeCss({
 *   light: { background: '#fff', foreground: '#000', ... },
 *   dark: { background: '#000', foreground: '#fff', ... }
 * });
 * // Returns CSS with :root, .theme-light, and .theme-dark rules
 * ```
 */
function buildThemeCss(colors: ColorConfig): string {
  return Object.entries(colors)
    .map(([name, v]) => {
      const decls = Object.entries(v as ColorVariant)
        .map(([k, val]) => `  ${VAR_MAP[k as keyof ColorVariant]}: ${val};`)
        .join("\n");
      const selector =
        name === "light" ? ":root, .theme-light" : `.theme-${name}`;
      return `${selector} {\n${decls}\n}`;
    })
    .join("\n\n");
}

/**
 * Renders a pre-paint theme script that applies the resolved theme class
 * and injects the theme CSS variables before first paint.
 *
 * The resolved {@link Config} is supplied by {@link AsheeUIProvider} so
 * runtime configuration never needs a bundler plugin or virtual module.
 *
 * This component renders a script that runs synchronously during HTML parsing,
 * before the browser paints any content. It reads the stored theme preference
 * or falls back to the default, resolves "system" to light or dark, applies
 * the correct theme class, and injects CSS variables.
 *
 * @param props - The component props.
 * @param props.config - The resolved AsheeUI configuration.
 * @returns A script element that applies the theme before paint.
 *
 * @example
 * ```tsx
 * // Used internally by AsheeUIProvider
 * <AsheeThemeScript config={resolvedConfig} />
 * ```
 *
 * @see AsheeUIProvider - The provider that uses this component.
 * @see themeController - The controller that manages theme state.
 */
export function AsheeThemeScript({ config }: { config: Config }) {
  const themes = Object.keys(config.color ?? {});
  const defaultTheme = config.defaultTheme ?? "system";
  const storageKey = THEME_STORAGE_KEY;
  const css = buildThemeCss(config.color);

  const script = `
    (function() {
      var el = document.documentElement;
      var storageKey = ${JSON.stringify(storageKey)};
      var defaultTheme = ${JSON.stringify(defaultTheme)};
      var themes = ${JSON.stringify(themes)};
      var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      var stored = null;
      try {
        stored = window.localStorage.getItem(storageKey);
      } catch (e) {}
      
      var selection = stored || defaultTheme;
      var resolved = selection === 'system' ? (systemDark ? 'dark' : 'light') : selection;
      
      var prefix = 'theme-';
      for (var i = el.classList.length - 1; i >= 0; i--) {
        if (el.classList[i].startsWith(prefix)) {
          el.classList.remove(el.classList[i]);
        }
      }
      el.classList.add(prefix + resolved);
      el.style.colorScheme = resolved;

      // Synchronously inject style tag before first paint
      var styleEl = document.getElementById(${JSON.stringify(THEME_VARS_STYLE_ID)});
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = ${JSON.stringify(THEME_VARS_STYLE_ID)};
        styleEl.textContent = ${JSON.stringify(css)};
        document.head.appendChild(styleEl);
      }
    })();
  `;

  return (
    <script
      id="ashee-theme-script"
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
