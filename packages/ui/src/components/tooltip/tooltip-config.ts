/**
 * Tooltip component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Tooltip
 * component, including variant, color, size, placement, delay, offset,
 * radius, and arrow options. It registers the default configuration with
 * the component registry and provides fallback values for the cascade
 * resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Color, Radius, Size, Variant } from "../../shared";
import { ASHEE_LAYER } from "../../utils/stacking";

/**
 * Placement of the tooltip relative to the trigger element.
 * Supports standard positions with start/end variations.
 */
export type TooltipPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";

/**
 * Size key for tooltips.
 * Maps to the standard Size type: "sm", "md", or "lg".
 */
export type TooltipSizeKey = Size;

/**
 * Theme configuration options for the Tooltip component.
 *
 * Set under `components.tooltip` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface TooltipConfig {
  /**
   * Visual style variant of the tooltip.
   * Controls the background and border treatment.
   *
   * @default "solid"
   */
  variant?: Variant;

  /**
   * Theme accent color of the tooltip.
   * Controls the color of the tooltip background and text.
   *
   * @default "secondary"
   */
  color?: Color;

  /**
   * Size scale of the tooltip.
   * Controls the padding and font size.
   *
   * @default "md"
   */
  size?: TooltipSizeKey;

  /**
   * Placement of the tooltip relative to the trigger.
   *
   * @default "top"
   */
  placement?: TooltipPlacement;

  /**
   * Delay in milliseconds before showing or hiding the tooltip.
   * Can be a number for both open and close, or an object with separate
   * open and close delays.
   *
   * @default 200
   */
  delay?: number | { open?: number; close?: number };

  /**
   * Offset in pixels between the tooltip and the trigger.
   *
   * @default 8
   */
  offset?: number;

  /**
   * Corner rounding of the tooltip.
   *
   * @default "md"
   */
  radius?: Radius;

  /**
   * Whether to show a pointer arrow on the tooltip.
   *
   * @default false
   */
  showArrow?: boolean;

  /**
   * Whether to render the tooltip through Floating UI's `FloatingPortal`.
   * When true, the tooltip is appended to `document.body`, which escapes
   * clipping and stacking contexts but also always paints above app-level
   * overlays such as sticky navbars.
   *
   * When false, the tooltip renders in place next to the trigger and follows
   * the trigger's own stacking context: a tooltip on a sticky navbar appears
   * above the page, while a tooltip on a page element stays underneath the
   * navbar. Enable `portal` for triggers inside scrollable or clipped
   * containers (for example a Modal panel or an overflow-hidden card).
   *
   * @default false
   * @see FloatingPortal - https://floating-ui.com/docs/FloatingPortal
   */
  portal?: boolean;

  /**
   * Layer delta added to the trigger's detected stacking-context z-index to
   * resolve the tooltip's final `z-index`. Anchored tooltips stay above their
   * own container (for example a sticky navbar) without outranking unrelated
   * app chrome.
   *
   * @default ASHEE_LAYER.tooltip
   */
  zIndex?: number;

  /**
   * Extra classes applied to every tooltip instance.
   *
   * @default ""
   */
  className?: string;
}

/**
 * Default config values registered for the Tooltip component.
 */
export const defaultTooltipConfig: TooltipConfig = {
  size: "md",
  placement: "top",
  delay: 200,
  offset: 8,
  showArrow: false,
  portal: false,
  zIndex: ASHEE_LAYER.tooltip,
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_TOOLTIP_CONFIG: Required<TooltipConfig> = {
  size: "md" as TooltipSizeKey,
  placement: "top" as TooltipPlacement,
  variant: "solid" as Variant,
  color: "secondary" as Color,
  delay: 200,
  offset: 8,
  radius: "md" as Radius,
  showArrow: false,
  portal: false,
  zIndex: ASHEE_LAYER.tooltip,
  className: "",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    tooltip: TooltipConfig;
  }
}

registerComponentDefaults("tooltip", defaultTooltipConfig);
