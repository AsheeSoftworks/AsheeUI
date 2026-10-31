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
 * The two properties this file used to assert — "the documented custom-theme declaration compiles"
 * and "`extends` may name another custom theme" — are type-level checks, and core cannot host one:
 * they were local aliases with an exported `_ColorConfigGuards` carrier that kept `noUnusedLocals`
 * quiet, and that carrier was a public name nobody read. C4 deleted all three and moved the
 * assertions to `packages/web/src/test/custom-theme.test.tsx`, where the configuration vocabulary is
 * consumed and where `tsc` is part of the gate. Deleting them instead would have removed the only
 * check that a custom theme with `extends` compiles — `apps/showcase` builds core's source with
 * `noUnusedLocals`, which is how this file found out that the carrier was load-bearing.
 */

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
