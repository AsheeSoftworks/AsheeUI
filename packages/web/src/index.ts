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
import "./components/system/scrollbar/scrollbar-config";

/**
 * Shared type exports.
 * These types are used across multiple components for consistency.
 */
/**
 * Theme type exports.
 * These types define the color system and theme configuration.
 */
export type {
  ActionConfig,
  AsheeColorRegistry,
  Color,
  ColorConfig,
  ColorVariant,
  DefaultColorConfig,
  ExternalConfig,
  Radius,
  Size,
  Space,
  ThemeName,
  Variant,
} from "@asheeui/core";
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
export * from "./components/data-display/accordion";
export * from "./components/feedback/alert";
export * from "./components/layouts/auth-layout";
export * from "./components/forms/autocomplete";
export * from "./components/data-display/avatar";
export * from "./components/data-display/badge";
export * from "./components/navigation/breadcrumb";
export * from "./components/forms/button";
export * from "./components/forms/calendar";
export * from "./components/data-display/card";
export * from "./components/data-display/carousel";
export * from "./components/layouts/centered";
export * from "./components/data-display/chip";
export * from "./components/data-display/clipboard";
export * from "./components/layouts/container";
export * from "./components/marketing/cta";
export * from "./components/data-display/data-table";
export * from "./components/layouts/docs-layout";
export * from "./components/overlays/drawer";
export * from "./components/forms/dropmenu";
export * from "./components/feedback/empty-state";
export * from "./components/feedback/error-state";
export * from "./components/marketing/feature-grid";
export * from "./components/forms/file-upload";
export * from "./components/navigation/footer";
export * from "./components/forms/form";
export * from "./components/layouts/grid";
export * from "./components/marketing/hero";
export * from "./components/data-display/image";
export * from "./components/forms/input";
export * from "./components/system/keyboard";
export * from "./components/navigation/link";
export * from "./components/feedback/loading-state";
export * from "./components/layouts/marketing-layout";
export * from "./components/data-display/marquee";
export * from "./components/overlays/modal";
export * from "./components/forms/multi-select";
export * from "./components/navigation/navbar";
export * from "./components/layouts/page";
export * from "./components/navigation/pagination";
export * from "./components/forms/pin-input";
export * from "./components/marketing/pricing-card";
export * from "./components/forms/radio";
export * from "./components/layouts/resizable-screen";
export * from "./components/forms/search-input";
export * from "./components/layouts/section";
export * from "./components/navigation/sidebar";
export * from "./components/layouts/sidebar-layout";
export * from "./components/feedback/skeleton";
export * from "./components/feedback/spinner";
export * from "./components/layouts/split";
export * from "./components/layouts/stack";
export * from "./components/forms/stepper";
export * from "./components/forms/switch";
export * from "./components/data-display/table";
export * from "./components/navigation/tabs";
export * from "./components/marketing/testimonials";
export * from "./components/forms/textarea";
export * from "./components/feedback/toast";
export * from "./components/overlays/tooltip";
export * from "./components/typography";
/**
 * The configuration context and the hooks that read it.
 *
 * The provider publishes the resolved configuration through this context, and a module
 * outside this package that composes framework components reads it to tell whether the
 * application has already provided one — the Puck integration does exactly that, so a
 * built page does not nest a second provider over the application's own. The hook is
 * the documented way for an application to read the configuration; it throws outside a
 * provider, which is why the context itself is exported beside it for the callers that
 * only need to ask whether one exists.
 */
export {
  AsheeConfigContext,
  useAshee,
  useAsheeConfig,
} from "./libs/context";
/**
 * Theme utilities and hooks.
 * These provide runtime theme management and reactivity.
 */
export {
  THEME_STORAGE_KEY,
  themeController,
} from "./theme/controller";
export { useTheme } from "./theme/useTheme";
