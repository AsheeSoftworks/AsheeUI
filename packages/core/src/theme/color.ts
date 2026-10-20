/**
 * Color configuration types for AsheeUI's theming system.
 * This file defines the structure of theme color palettes, including
 * the required built-in themes (light and dark) and optional custom
 * theme extensions. It provides the type foundation for the color
 * configuration that powers the component library's visual system.
 */

/**
 * The built-in theme names that are always available in AsheeUI.
 * "light" and "dark" are the core themes that every installation provides.
 */
export type KnownThemeName = "light" | "dark";

/**
 * Registry of available color themes in AsheeUI.
 *
 * The two built-in themes are stated here, and the interface stays open: a consumer may
 * still augment it to declare the names its application uses,
 *
 * ```ts
 * declare module "@asheeui/core" {
 *   interface AsheeColorRegistry {
 *     midnight: true;
 *   }
 * }
 * ```
 *
 * but that augmentation is no longer required. {@link ThemeName} accepts any string, so a
 * custom theme needs no registry entry to be a theme as far as the types are concerned.
 * The interface is kept because it is published API: an augmentation written for an earlier
 * release has to keep compiling.
 */
export interface AsheeColorRegistry {
  light: true;
  dark: true;
}

/**
 * All available theme names in AsheeUI.
 *
 * A theme name is the key under `color` in the configuration, and any string is one:
 * `light` and `dark` ship with the library, and `"midnight"` is a theme as soon as a
 * configuration declares it. The union with `string & {}` keeps `light` and `dark`
 * discoverable in completion while accepting a name the library has never heard of —
 * closing the type over the built-ins made the documented custom-theme declaration fail
 * to compile (`TS2353` on the palette key, `TS2322` on `defaultTheme`, `TS2345` on
 * `setTheme`), which forced every consumer to cast.
 */
export type ThemeName = KnownThemeName | (string & {});

/**
 * The complete set of color variables required for a single theme.
 * These colors are used throughout the component library for
 * backgrounds, text, borders, interactive elements, and status indicators.
 */
export interface ColorVariant {
  /**
   * The main background color of the application.
   * Used for page backgrounds and container surfaces.
   */
  background: string;

  /**
   * The primary text color.
   * Used for body text and other foreground content.
   */
  foreground: string;

  /**
   * The primary brand or interactive color.
   * Used for buttons, links, and other interactive elements.
   */
  primary: string;

  /**
   * The secondary surface color.
   * Used for cards, panels, and other elevated surfaces.
   */
  secondary: string;

  /**
   * The border color.
   * Used for separators, input borders, and dividing lines.
   */
  border: string;

  /**
   * The danger or error color.
   * Used for destructive actions and error states.
   */
  danger: string;

  /**
   * The warning color.
   * Used for cautionary states and warnings.
   */
  warning: string;

  /**
   * The success color.
   * Used for success states and positive feedback.
   */
  success: string;

  /**
   * The scrollbar thumb color.
   * Used for the draggable handle of scrollbars.
   */
  scrollbarThumb: string;

  /**
   * The scrollbar track color.
   * Used for the background track of scrollbars.
   */
  scrollbarTrack: string;
}

/**
 * Built-in colors map required by the core library.
 * Both "light" and "dark" themes must be fully defined.
 */
export type DefaultColorConfig = Record<KnownThemeName, ColorVariant>;

/**
 * Full color configuration.
 * Built-in themes are strictly required; every other key is a custom theme and is
 * optional, because a resolved configuration only holds the themes a consumer declared.
 */
export type ColorConfig = Record<KnownThemeName, ColorVariant> &
  Partial<Record<string, ColorVariant>>;

/**
 * A color variant that can be partially defined.
 * Custom themes can extend any theme, built in or custom, to inherit its colors.
 */
export type ExternalColorVariant = Partial<ColorVariant> & {
  /**
   * Optional theme to extend.
   * When provided, the custom theme inherits colors from the theme it names, with any
   * explicitly defined colors overriding the inherited values.
   *
   * The name may be a built-in theme (`light`/`dark`, including the consumer's overrides of
   * them) or another custom theme declared in the same `color` object, in any declaration
   * order. `ThemeName` is the narrowest type that can state that: which names are declared is
   * known only at runtime, so the configuration validator checks the declared set and rejects
   * a name that is neither built in nor declared.
   */
  extends?: ThemeName | undefined;
};

/**
 * External color configuration format.
 * Built-in themes can be partially overridden, while custom themes provide at least a
 * partial color variant (with optional extension). The key is the theme's name, and any
 * name is accepted: `midnight` needs no registry entry, no module augmentation and no cast.
 */
export type ExternalColorConfig = Record<string, ExternalColorVariant>;

/**
 * Compile-time guard: a theme map the types have to accept.
 *
 * The constraint is what makes the guard enforce anything. A bare
 * `Map extends ExternalColorConfig ? true : never` alias resolves to `never` when the map is
 * rejected, and an unused alias that resolves to `never` is not a compile error, so it would
 * only look like a check. Instantiating this with a rejected map fails the constraint.
 */
type AcceptedColorConfig<T extends ExternalColorConfig> = T;

/**
 * Compile-time guard: the documented custom-theme declaration has to compile as written,
 * without a registry entry and without a cast. `ExternalColorConfig` is the half of that
 * declaration this file can state; `defaultTheme` and `setTheme` are checked in
 * `packages/web/src/test/custom-theme.test.tsx`, where those symbols live.
 */
type _CustomThemeDeclarationCompiles = AcceptedColorConfig<{
  midnight: { extends: "dark"; background: string; primary: string };
}>;

/**
 * Compile-time guard: `extends` may name another custom theme, so it cannot be closed over
 * the built-ins. Closing it made `brand: { extends: "midnight" }` fail to compile, and typed
 * code could not reach the resolver's cross-theme support at all.
 */
type _CustomThemeExtendsDeclaredTheme = AcceptedColorConfig<{
  brand: { extends: "midnight"; primary: string };
  midnight: { extends: "dark"; background: string };
}>;

/**
 * The two guards above, kept in one place a compiler can see.
 *
 * They are checks rather than values, so nothing reads them — and a consumer whose build enables
 * `noUnusedLocals` reports them. Referencing them here keeps the checks alive without inventing a
 * runtime object to carry them. Not part of the API: ignore it.
 */
export type _ColorConfigGuards = [
  _CustomThemeDeclarationCompiles,
  _CustomThemeExtendsDeclaredTheme,
];

/**
 * The default color configuration for AsheeUI.
 * Provides complete color variants for both light and dark themes
 * with carefully chosen default values that work out of the box.
 */
export const defaultColorConfig: DefaultColorConfig = {
  light: {
    background: "#ffffff",
    foreground: "#000000",
    primary: "#2563eb",
    secondary: "#f3f4f6",
    border: "#d5d5d5",
    danger: "#dc2626",
    warning: "#d97706",
    success: "#16a34a",
    scrollbarThumb: "#3b82f6",
    scrollbarTrack: "transparent",
  },
  dark: {
    background: "#111111",
    foreground: "#ffffff",
    primary: "#005bc4",
    secondary: "#262626",
    border: "#2a2a2a",
    danger: "#ef4444",
    warning: "#f59e0b",
    success: "#22c55e",
    scrollbarThumb: "#1e40af",
    scrollbarTrack: "#1f293700",
  },
};
