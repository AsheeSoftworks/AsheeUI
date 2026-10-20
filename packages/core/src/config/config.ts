/**
 * Configuration types for AsheeUI.
 * This file defines the core configuration structure that controls the
 * library's appearance and behavior. The Config type combines theme settings,
 * component defaults, and global styling preferences. ExternalConfig provides
 * a partial version that users can provide to customize the library.
 */

import type { ComponentConfigRegistry } from "../registry";
import type { Color, Radius, Variant } from "../shared";
import type {
  ColorConfig,
  ExternalColorConfig,
  ThemeName,
} from "../theme/color";
import type { DeepPartial } from "../utils";

export type { DeepPartial } from "../utils";

/**
 * Component-specific configuration overrides.
 * Each key is the component's registration name, the lowercase name its config
 * module passes to `registerComponentDefaults` (e.g., "button", "input"; the
 * camelCase exceptions are "multiSelect" and "resizableScreen"). A key that does
 * not match a registration is ignored, so a capitalised export name such as
 * "Button" configures nothing. The value is a partial configuration object for
 * that component, merged with the component's registered defaults and instance
 * props.
 */
export type ComponentsConfig = {
  [K in keyof ComponentConfigRegistry]?: DeepPartial<
    ComponentConfigRegistry[K]
  >;
};

/**
 * The complete AsheeUI configuration.
 * This object defines all theme settings, default values, and component
 * overrides that control the library's appearance and behavior.
 */
export type Config = {
  /**
   * Color configuration for all themes.
   * Defines the color palette for each theme, including built-in and custom themes.
   */
  color: ColorConfig;

  /**
   * The default theme to use when no user preference is stored.
   * Can be a specific theme name or "system" to follow system preference.
   * @default "system"
   */
  defaultTheme?: ThemeName | "system" | undefined;

  /**
   * The default variant for components that support variants.
   * Controls the visual style like solid, ghost, bordered, etc.
   * @default "faded"
   */
  defaultVariant?: Variant | undefined;

  /**
   * The default color for components that support colors.
   * Controls the accent color like primary, secondary, danger, etc.
   * @default "primary"
   */
  defaultColor?: Color | undefined;

  /**
   * The default border radius for components.
   * Controls the rounded corners of elements that leave their radius to the
   * application; a component that registers its own radius keeps it.
   * @default "xs"
   */
  defaultRadius?: Radius | undefined;

  /**
   * Component-specific configuration overrides.
   * Allows setting default props for individual components.
   */
  components?: ComponentsConfig | undefined;
};

/**
 * External configuration format for users.
 * This is a partial version of Config where all fields are optional.
 * Users provide this to customize the library, and it gets merged
 * with the default configuration.
 */
export type ExternalConfig = DeepPartial<Omit<Config, "color">> & {
  /**
   * Color configuration that can partially override or extend themes.
   * Built-in themes can be partially overridden, and custom themes can be added.
   */
  color?: ExternalColorConfig | undefined;
};
