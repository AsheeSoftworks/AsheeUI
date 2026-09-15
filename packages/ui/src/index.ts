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

// Structural scrollbar theming is configuration rather than a component: it is
// imported for its registration side effect and deliberately not re-exported,
// so it never appears in the public component inventory.
import "./components/scrollbar/scrollbar-config";

export type { AsheeUIProviderProps } from "./AsheeUIProvider";
export { AsheeUIProvider } from "./AsheeUIProvider";

/**
 * All component exports.
 * Each component is exported from its respective directory.
 *
 * Internal building blocks (`field` and `menu`) are deliberately not
 * exported. They are implementation details shared by the components that
 * use them, so they are not part of the public component surface and must
 * not be listed as components.
 */
export * from "./components/accordion";
export * from "./components/alert";
export * from "./components/auth-layout";
export * from "./components/autocomplete";
export * from "./components/avatar";
export * from "./components/badge";
export * from "./components/breadcrumb";
export * from "./components/button";
export * from "./components/calendar";
export * from "./components/card";
export * from "./components/carousel";
export * from "./components/centered";
export * from "./components/chip";
export * from "./components/clipboard";
export * from "./components/container";
export * from "./components/cta";
export * from "./components/data-table";
export * from "./components/docs-layout";
export * from "./components/drawer";
export * from "./components/dropmenu";
export * from "./components/empty-state";
export * from "./components/error-state";
export * from "./components/feature-grid";
export * from "./components/file-upload";
export * from "./components/footer";
export * from "./components/form";
export * from "./components/grid";
export * from "./components/hero";
export * from "./components/image";
export * from "./components/input";
export * from "./components/keyboard";
export * from "./components/link";
export * from "./components/loading-state";
export * from "./components/marketing-layout";
export * from "./components/marquee";
export * from "./components/modal";
export * from "./components/multi-select";
export * from "./components/navbar";
export * from "./components/page";
export * from "./components/pagination";
export * from "./components/pin-input";
export * from "./components/pricing-card";
export * from "./components/radio";
export * from "./components/resizable-screen";
export * from "./components/search-input";
export * from "./components/section";
export * from "./components/sidebar";
export * from "./components/sidebar-layout";
export * from "./components/skeleton";
export * from "./components/spinner";
export * from "./components/split";
export * from "./components/stack";
export * from "./components/stepper";
export * from "./components/switch";
export * from "./components/table";
export * from "./components/tabs";
export * from "./components/testimonials";
export * from "./components/textarea";
export * from "./components/toast";
export * from "./components/tooltip";
export * from "./components/typography";
export type { ExternalConfig } from "./config";
/**
 * Shared type exports.
 * These types are used across multiple components for consistency.
 */
export type {
  ActionConfig,
  Color,
  Radius,
  Size,
  Space,
  Variant,
} from "./shared";
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
