/**
 * Pre-paint theme script for AsheeUI.
 * This file provides the AsheeThemeScript component that injects CSS variables
 * and applies the correct theme class synchronously before the initial paint.
 * This prevents Flash of Unstyled Content (FOUC) by ensuring the theme is
 * applied before any content is rendered. The script runs during SSR and
 * client-side hydration, using the resolved configuration from the provider.
 */

import type { ColorConfig, ColorVariant, Config } from "@asheeui/core";
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
 * The ID used for the script element that applies the theme before paint.
 *
 * The provider renders that element into the server output, and again while
 * that output is hydrated, because those are the only places where a browser
 * runs it. A client-only render is covered by {@link ensureThemeVarsStyle}.
 *
 * Only the provider that owns the document renders it. A provider mounted below the
 * application's own states its own theme list and default theme, and a script of its own
 * would run later in the parse and paint *its* default — the override the controller's
 * union rule exists to prevent. See `AsheeUIProvider`.
 */
export const THEME_SCRIPT_ID = "ashee-theme-script";

/**
 * One theme's variable block, as a selector and its declarations.
 *
 * The light theme uses both `:root` and `.theme-light` so a document with no theme class
 * at all still has a palette.
 *
 * @param name - The theme's name.
 * @param variant - Its resolved colours.
 * @returns A single CSS rule.
 */
function buildThemeBlock(name: string, variant: ColorVariant): string {
  const declarations = Object.entries(variant)
    .map(([key, value]) => `  ${VAR_MAP[key as keyof ColorVariant]}: ${value};`)
    .join("\n");
  const selector = name === "light" ? ":root, .theme-light" : `.theme-${name}`;

  return `${selector} {\n${declarations}\n}`;
}

/**
 * Builds CSS string for all theme color variables.
 * Generates CSS rules that define CSS custom properties for each theme.
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
    .map(([name, variant]) => buildThemeBlock(name, variant as ColorVariant))
    .join("\n\n");
}

/**
 * Mapping from the structural scrollbar configuration to the CSS variables
 * `index.css` reads them from.
 */
const SCROLLBAR_VAR_MAP = {
  width: "--ashee-scrollbar-width",
  radius: "--ashee-scrollbar-radius",
  trackRadius: "--ashee-scrollbar-track-radius",
  thumbBorder: "--ashee-scrollbar-thumb-border",
  gutter: "--ashee-scrollbar-gutter",
  fallbackWidth: "--ashee-scrollbar-fallback-width",
} as const;

/** The structural scrollbar configuration once it is resolved into the config. */
type ResolvedScrollbarConfig = NonNullable<
  NonNullable<Config["components"]>["scrollbar"]
>;

/**
 * Build the CSS for the structural scrollbar configuration.
 *
 * `index.css` styles every scrollbar through `--ashee-scrollbar-*`, so those
 * values have to be emitted for `components.scrollbar` to have any effect.
 * `trackRadius` falls back to `radius`, which is what the configuration
 * documents.
 *
 * @param scrollbar - The resolved scrollbar configuration, when there is one.
 * @returns The CSS block, or an empty string when there is nothing to emit.
 */
function buildScrollbarCss(
  scrollbar: ResolvedScrollbarConfig | undefined,
): string {
  if (!scrollbar) return "";

  const values: Record<keyof typeof SCROLLBAR_VAR_MAP, string | undefined> = {
    width: scrollbar.width,
    radius: scrollbar.radius,
    trackRadius: scrollbar.trackRadius ?? scrollbar.radius,
    thumbBorder: scrollbar.thumbBorder,
    gutter: scrollbar.gutter,
    fallbackWidth: scrollbar.fallbackWidth,
  };

  const declarations = Object.entries(SCROLLBAR_VAR_MAP)
    .map(([key, variable]) => {
      const value = values[key as keyof typeof SCROLLBAR_VAR_MAP];
      return value ? `  ${variable}: ${value};` : null;
    })
    .filter((declaration): declaration is string => declaration !== null);

  return declarations.length > 0
    ? `:root {\n${declarations.join("\n")}\n}`
    : "";
}

/**
 * Build the complete content of the theme style element.
 *
 * @param config - The resolved configuration.
 * @returns The colour variables for every theme, followed by the structural
 *   scrollbar variables.
 */
export function buildThemeVarsCss(config: Config): string {
  return [
    buildThemeCss(config.color),
    buildScrollbarCss(config.components?.scrollbar),
  ]
    .filter((block) => block !== "")
    .join("\n\n");
}

/**
 * The variable blocks that have been registered for the document, keyed by theme name.
 *
 * A `Map` rather than a string, because the blocks are registered by several callers and
 * a later registration has to be able to replace one palette without disturbing the
 * order: `light` first is what lets `.theme-dark` and a custom theme override `:root` at
 * equal specificity.
 */
const registeredBlocks = new Map<string, string>();

/** The key the structural scrollbar block is filed under. */
const SCROLLBAR_BLOCK_KEY = "\u0000scrollbar";

/** The stylesheet text last written, so an unchanged rebuild is a no-op. */
let appliedCss = "";

/**
 * Ensure the theme CSS variables are present in the document.
 *
 * The pre-paint script injects them while the server HTML is parsed. A
 * client-only render never runs that script, because React does not execute a
 * script it creates, so the provider calls this before the first paint.
 *
 * The blocks are **registered and rebuilt**, never written once. A provider may be
 * mounted below the application's own — a page that demonstrates its own configuration
 * — and React runs a child's effects before its parent's, so that nested provider reaches
 * this function first with a configuration that usually declares only the built-in
 * themes. Writing on the first call and returning on every later one left the stylesheet
 * holding `:root, .theme-light` and nothing else: the application's custom theme got its
 * class but had no variables, so the page painted with the light palette. Rebuilding from
 * the union is what makes the order irrelevant. Where two registrations state the same
 * theme, the later one wins, which is why the application's provider — the last to run —
 * is authoritative for the palette.
 *
 * @param config - The resolved configuration.
 *
 * @see THEME_VARS_STYLE_ID - The id of the element this creates.
 */
export function ensureThemeVarsStyle(config: Config): void {
  if (typeof document === "undefined") return;

  for (const [name, variant] of Object.entries(config.color ?? {})) {
    registeredBlocks.set(name, buildThemeBlock(name, variant as ColorVariant));
  }

  const scrollbar = buildScrollbarCss(config.components?.scrollbar);
  if (scrollbar === "") registeredBlocks.delete(SCROLLBAR_BLOCK_KEY);
  else registeredBlocks.set(SCROLLBAR_BLOCK_KEY, scrollbar);

  const css = [...registeredBlocks.values()].join("\n\n");
  let style = document.getElementById(THEME_VARS_STYLE_ID);

  // The element may be missing even when the text is unchanged — a test or a consumer can
  // remove it — so the no-op path checks for both.
  if (style && css === appliedCss) return;

  if (!style) {
    style = document.createElement("style");
    style.id = THEME_VARS_STYLE_ID;
    document.head.appendChild(style);
  }

  style.textContent = css;
  appliedCss = css;
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
  const css = buildThemeVarsCss(config);

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
      if (selection !== 'system' && themes.indexOf(selection) === -1) {
        selection = defaultTheme;
      }
      var resolved = selection === 'system' ? (systemDark ? 'dark' : 'light') : selection;
      if (themes.indexOf(resolved) === -1) {
        resolved = themes.indexOf(defaultTheme) !== -1 ? defaultTheme : (themes[0] || resolved);
      }
      
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
      id={THEME_SCRIPT_ID}
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
