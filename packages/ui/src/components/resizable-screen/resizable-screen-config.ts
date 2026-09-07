/**
 * ResizableScreen component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the ResizableScreen
 * component, which provides a split panel layout with a draggable handle for
 * resizing the primary panel. It registers the default configuration with the
 * component registry and provides fallback values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";

/**
 * The orientation of the resizable split.
 * - `horizontal`: Panels are side by side (left/right).
 * - `vertical`: Panels are stacked (top/bottom).
 */
export type ResizableOrientation = "horizontal" | "vertical";

/**
 * Theme configuration options for the ResizableScreen component.
 *
 * Set under `components.resizableScreen` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface ResizableScreenConfig {
  /**
   * Default size of the primary panel as a percentage (0-100).
   * Used when the component is uncontrolled.
   *
   * @default 50
   */
  defaultSize?: number;

  /**
   * Minimum size of the primary panel as a percentage (0-100).
   * Prevents the panel from being resized below this value.
   *
   * @default 20
   */
  minSize?: number;

  /**
   * Maximum size of the primary panel as a percentage (0-100).
   * Prevents the panel from being resized above this value.
   *
   * @default 80
   */
  maxSize?: number;

  /**
   * Step size in percentage points for keyboard resizing.
   * Controls how much the size changes per arrow key press.
   *
   * @default 2
   */
  step?: number;

  /**
   * The orientation of the split layout.
   * Controls whether panels are arranged side by side or stacked.
   *
   * @default "horizontal"
   */
  orientation?: ResizableOrientation;

  /**
   * Whether to hide the resize handle.
   * When true, the drag handle is not rendered.
   *
   * @default false
   */
  hideHandle?: boolean;
}

/**
 * Default config values registered for the ResizableScreen component.
 */
export const defaultResizableScreenConfig: ResizableScreenConfig = {
  defaultSize: 50,
  minSize: 20,
  maxSize: 80,
  step: 2,
  orientation: "horizontal",
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_RESIZABLE_SCREEN_CONFIG: Required<ResizableScreenConfig> =
  {
    defaultSize: 50,
    minSize: 20,
    maxSize: 80,
    step: 2,
    orientation: "horizontal",
    hideHandle: false,
  } as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    resizableScreen: ResizableScreenConfig;
  }
}

registerComponentDefaults("resizableScreen", defaultResizableScreenConfig);
