/**
 * AsheeUI main entry point.
 * This file exports all public components, types, and utilities from the
 * AsheeUI component library. It serves as the single entry point for
 * consumers of the library.
 *
 * The exports are organized into:
 * - Core provider: AsheeUIProvider and its props
 * - All components: accordion, button, card, modal, toast, etc.
 * - Shared types: Radius, Size, Variant, Color
 * - Theme types: ColorConfig, ThemeName, ColorVariant
 * - Theme utilities: themeController, useTheme, THEME_STORAGE_KEY
 */

export type { AsheeUIProviderProps } from "./AsheeUIProvider";
export { AsheeUIProvider } from "./AsheeUIProvider";

/**
 * All component exports.
 * Each component is exported from its respective directory.
 */
export * from "./components/accordion";
export * from "./components/autocomplete";
export * from "./components/button";
export * from "./components/card";
export * from "./components/carousel";
export * from "./components/chip";
export * from "./components/date-picker";
export * from "./components/drawer";
export * from "./components/field";
export * from "./components/image";
export * from "./components/input";
export * from "./components/keyboard";
export * from "./components/link";
export * from "./components/marquee";
export * from "./components/modal";
export * from "./components/multi-select";
export * from "./components/radio";
export * from "./components/resizable-screen";
export * from "./components/select";
export type { SelectMenuOption } from "./components/select-menu";
export * from "./components/sidebar";
export * from "./components/spinner";
export * from "./components/switch";
export * from "./components/table";
export * from "./components/tabs";
export * from "./components/textarea";
export * from "./components/toast";
export * from "./components/tooltip";
export type { ExternalConfig } from "./config";
/**
 * Shared type exports.
 * These types are used across multiple components for consistency.
 */
export type { Color, Radius, Size, Variant } from "./shared";
/**
 * Theme type exports.
 * These types define the color system and theme configuration.
 */
export type {
  AsheeColorRegistry,
  ColorConfig,
  ColorVariant,
  DefaultColorConfig,
  ThemeName,
} from "./theme/color";
/**
 * Theme utilities and hooks.
 * These provide runtime theme management and reactivity.
 */
export {
  THEME_STORAGE_KEY,
  themeController,
} from "./theme/controller";
export { useTheme } from "./theme/useTheme";
