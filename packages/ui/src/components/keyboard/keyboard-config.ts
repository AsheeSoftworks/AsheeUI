/**
 * Keyboard component configuration for AsheeUI.
 * This file defines the configuration types, layouts, and display mappings
 * for the on-screen virtual keyboard. It provides default layouts for
 * alphabetic, shifted, symbols, and numeric modes, along with display
 * labels for special keys. The configuration is registered with the
 * component registry for theme-level overrides.
 */

import type { ReactNode } from "react";
import { registerComponentDefaults } from "../../libs/registry";
import type { Color, Radius, Size, Variant } from "../../shared";

/**
 * Standard layout names for the virtual keyboard.
 * - `default`: Lowercase alphabetic layout.
 * - `shift`: Uppercase alphabetic layout.
 * - `symbols`: Symbol and punctuation layout.
 * - `numeric`: Numeric keypad layout.
 */
export type StandardLayoutName = "default" | "shift" | "symbols" | "numeric";

/**
 * Layout name type that supports custom layouts.
 * Can be either a StandardLayoutName or a custom string identifier.
 */
export type LayoutName = StandardLayoutName | (string & {});

/**
 * Size key for the keyboard.
 * Maps to the standard Size type: "sm", "md", or "lg".
 * Controls the height, font size, and padding of keyboard keys.
 */
export type KeyboardSizeKey = Size;

/**
 * Mapping of layout names to arrays of row strings.
 * Each row string contains space-separated key tokens.
 */
export type KeyboardLayouts = Record<string, string[]>;

/**
 * Mapping of key tokens to display React nodes.
 * Used to render special keys with icons or custom labels.
 */
export type KeyDisplayMap = Record<string, ReactNode>;

/**
 * Per-keyboard styling options that can override provider defaults.
 */
export interface KeyboardStylingOptions {
  /**
   * Size scale for keyboard keys.
   * Controls the height, font size, and padding of individual keys.
   */
  size?: KeyboardSizeKey;

  /**
   * Visual style variant for keyboard keys.
   */
  variant?: Variant;

  /**
   * Theme accent color for keyboard keys.
   */
  color?: Color;

  /**
   * Corner rounding for keyboard keys.
   */
  radius?: Radius;

  /**
   * Whether to render the keyboard in a Floating UI portal.
   */
  portal?: boolean;
}

/**
 * Theme configuration options for the Keyboard component.
 *
 * Set under `components.keyboard` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface KeyboardConfig extends KeyboardStylingOptions {
  /**
   * The layouts available for the keyboard.
   * Maps layout names to arrays of row strings.
   */
  layouts?: KeyboardLayouts;

  /**
   * Display mappings for special keys.
   * Maps tokens like "{bksp}" to display labels.
   */
  display?: KeyDisplayMap;

  /**
   * The default layout to show when the keyboard opens.
   * @default "default"
   */
  defaultLayout?: LayoutName;

  /**
   * Delay in milliseconds before closing the keyboard on blur.
   * @default 500
   */
  closeDelay?: number;

  /**
   * Whether to automatically switch back from shift after a key press.
   * @default true
   */
  autoShiftBack?: boolean;

  /**
   * Whether the keyboard system is globally disabled.
   * When true, all keyboard interactions are prevented.
   * @default false
   */
  disabled?: boolean;
}

/**
 * Default keyboard layouts.
 * Provides alphabetic, shifted, symbols, and numeric layouts with
 * special keys for backspace, enter, shift, layout switching, and space.
 */
export const defaultKeyboardLayouts: KeyboardLayouts = {
  default: [
    "1 2 3 4 5 6 7 8 9 0 {bksp}",
    "q w e r t y u i o p",
    "a s d f g h j k l",
    "{shift} z x c v b n m {shift}",
    "{symbols} , {space} . {enter}",
  ],
  shift: [
    "1 2 3 4 5 6 7 8 9 0 {bksp}",
    "Q W E R T Y U I O P",
    "A S D F G H J K L",
    "{shift} Z X C V B N M {shift}",
    "{symbols} , {space} . {enter}",
  ],
  symbols: [
    "1 2 3 4 5 6 7 8 9 0 {bksp}",
    "@ # $ _ & - + ( )",
    "* \" ' : ; ! ? %",
    "{abc} / \\ ~ ` = {abc}",
    "{abc} , {space} . {enter}",
  ],
  numeric: ["1 2 3 {bksp}", "4 5 6 {clear}", "7 8 9 {enter}", "0 . {space}"],
};

/**
 * Default display mappings for special keys.
 * Maps token names to their display labels or icons.
 */
export const defaultKeyDisplay: KeyDisplayMap = {
  "{bksp}": "⌫",
  "{enter}": "↵",
  "{shift}": "⇧",
  "{symbols}": "?123",
  "{abc}": "ABC",
  "{space}": "space",
  "{clear}": "C",
};

/**
 * Default configuration values registered for the Keyboard component.
 */
export const defaultKeyboardConfig: KeyboardConfig = {
  layouts: defaultKeyboardLayouts,
  display: defaultKeyDisplay,
  defaultLayout: "default",
  closeDelay: 500,
  autoShiftBack: true,
  size: "md",
  portal: true,
  disabled: false,
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    keyboard: KeyboardConfig;
  }
}

registerComponentDefaults("keyboard", defaultKeyboardConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_KEYBOARD_CONFIG = {
  defaultLayout: "default" as LayoutName,
  size: "md" as KeyboardSizeKey,
  variant: "solid" as Variant,
  color: "primary" as Color,
  radius: "md" as Radius,
  portal: true,
  disabled: false,
  closeDelay: 500,
  autoShiftBack: true,
} as const;
