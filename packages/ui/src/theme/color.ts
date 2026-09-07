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
 * Currently supports the built-in "light" and "dark" themes.
 * This interface serves as the constraint for theme name resolution.
 */
export interface AsheeColorRegistry {
  light: true;
  dark: true;
}

/**
 * All available theme names in AsheeUI.
 * This is derived from the AsheeColorRegistry and includes both
 * built-in themes and any custom themes defined by the user.
 */
export type ThemeName = keyof AsheeColorRegistry;

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
 * Built-in themes are strictly required. Custom augmented themes are optional
 * on default/unmerged configs, but enforced via ExternalColorConfig.
 */
export type ColorConfig = Record<KnownThemeName, ColorVariant> &
  Partial<Record<Exclude<ThemeName, KnownThemeName>, ColorVariant>>;

/**
 * A color variant that can be partially defined.
 * Custom themes can extend a known theme to inherit its colors.
 */
export type ExternalColorVariant = Partial<ColorVariant> & {
  /**
   * Optional theme to extend.
   * When provided, the custom theme will inherit colors from the specified
   * built-in theme, with any explicitly defined colors overriding the inherited values.
   */
  extends?: KnownThemeName;
};

type CustomThemeName = Exclude<ThemeName, KnownThemeName>;

/**
 * External color configuration format.
 * Built-in themes can be partially overridden, while custom themes
 * must provide at least a partial color variant (with optional extension).
 */
export type ExternalColorConfig = Partial<
  Record<KnownThemeName, Partial<ColorVariant>>
> &
  Record<CustomThemeName, ExternalColorVariant>;

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
    secondary: "#ffffff",
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
    secondary: "#1a1a1a",
    border: "#2a2a2a",
    danger: "#ef4444",
    warning: "#f59e0b",
    success: "#22c55e",
    scrollbarThumb: "#1e40af",
    scrollbarTrack: "#1f293700",
  },
};
