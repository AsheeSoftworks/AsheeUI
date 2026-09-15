/**
 * Clipboard and CopyButton component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the clipboard pair:
 * how long the copied state lasts and how the copy control looks. It registers
 * the default configuration with the component registry and provides fallback
 * values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Color, Radius, Size, Variant } from "../../shared";

/**
 * Theme configuration options for the clipboard components.
 *
 * Set under `components.clipboard` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface ClipboardConfig {
  /**
   * How long the copied state lasts, in milliseconds.
   *
   * @default 2000
   */
  timeout?: number;

  /** Name of the copy control. @default "Copy" */
  label?: string;

  /** Name of the copy control once the text is on the clipboard.
   * @default "Copied" */
  copiedLabel?: string;

  /** Visual style of the copy control. @default "bordered" */
  variant?: Variant;

  /** Accent colour of the copy control. @default "primary" */
  color?: Color;

  /** Density of the copy control. @default "sm" */
  size?: Size;

  /** Corner rounding of the copy control. Defaults to the framework radius. */
  radius?: Radius;
}

/**
 * Default config values registered for the clipboard components.
 */
export const defaultClipboardConfig: ClipboardConfig = {
  timeout: 2000,
  label: "Copy",
  copiedLabel: "Copied",
  variant: "bordered",
  color: "primary",
  size: "sm",
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    clipboard: ClipboardConfig;
  }
}

registerComponentDefaults("clipboard", defaultClipboardConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_CLIPBOARD_CONFIG: Required<ClipboardConfig> = {
  timeout: 2000,
  label: "Copy",
  copiedLabel: "Copied",
  variant: "bordered",
  color: "primary",
  size: "sm",
  radius: "sm",
};
