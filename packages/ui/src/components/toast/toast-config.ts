/**
 * Toast component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Toast
 * notification system, including size, placement, variant, radius,
 * animation, timeout, and queue management options. It registers the
 * default configuration with the component registry and provides fallback
 * values for the cascade resolution system.
 */

import type { ReactNode } from "react";
import { registerComponentDefaults } from "../../libs/registry";
import type { Radius, Size, Variant } from "../../shared";

/**
 * Type of toast notification.
 * Determines the icon and color styling.
 */
export type ToastType = "success" | "error" | "info" | "warning" | "default";

/**
 * Placement of the toast container on the screen.
 * Controls where toasts appear and animate from.
 */
export type ToastPlacement =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

/**
 * Data structure for a single toast notification.
 */
export interface ToastItemData {
  /**
   * Unique identifier for the toast.
   */
  id: string;

  /**
   * Optional title text.
   * Displayed above the message in bold.
   */
  title?: ReactNode;

  /**
   * The main message content.
   */
  message: ReactNode;

  /**
   * Type of toast.
   * Controls icon and color styling.
   *
   * @default "info"
   */
  type?: ToastType;

  /**
   * Duration in milliseconds before auto-dismissal.
   * Set to 0 or negative to disable auto-dismiss.
   *
   * @default 3500
   */
  timeout?: number;

  /**
   * Custom icon element.
   * Overrides the default icon for the toast type.
   */
  icon?: ReactNode;

  /**
   * Action element rendered below the message.
   * Typically a button for user interaction.
   */
  action?: ReactNode;

  /**
   * Whether the toast can be dismissed by the user.
   * When true, shows a close button.
   *
   * @default true
   */
  dismissible?: boolean;
}

/**
 * Theme configuration options for the Toast system.
 *
 * Set under `components.toast` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface ToastConfig {
  /**
   * Size scale of toast notifications.
   * Controls the width and padding of toasts.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * Placement of the toast container.
   * Controls where toasts appear on screen.
   *
   * @default "top-right"
   */
  placement?: ToastPlacement;

  /**
   * Visual style variant of toasts.
   * Controls the background and border treatment.
   *
   * @default "bordered"
   */
  variant?: Variant;

  /**
   * Corner rounding of toast notifications.
   *
   * @default "md"
   */
  radius?: Radius;

  /**
   * Whether toasts have enter and exit animations.
   *
   * @default true
   */
  animated?: boolean;

  /**
   * Default timeout duration in milliseconds.
   * Used when a toast does not specify its own timeout.
   *
   * @default 3500
   */
  defaultTimeout?: number;

  /**
   * Maximum number of toasts to display at once.
   * Older toasts are removed when this limit is exceeded.
   *
   * @default 5
   */
  maxToasts?: number;

  /**
   * Whether to render toasts in a React portal.
   * When true, toasts are rendered at the document body level,
   * escaping any parent DOM hierarchy. This prevents CSS containment
   * and stacking context issues. Defaults to true because toasts
   * should always appear above other content.
   *
   * @default true
   */
  portal?: boolean;
}

/**
 * Default config values registered for the Toast component.
 */
export const defaultToastConfig: ToastConfig = {
  size: "md",
  placement: "top-right",
  variant: "bordered",
  radius: "md",
  animated: true,
  defaultTimeout: 3500,
  maxToasts: 5,
  portal: true,
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_TOAST_CONFIG = {
  size: "md" as Size,
  placement: "top-right" as ToastPlacement,
  variant: "solid" as Variant,
  radius: "md" as Radius,
  animated: true,
  defaultTimeout: 3500,
  maxToasts: 5,
  portal: true,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    toast: ToastConfig;
  }
}

registerComponentDefaults("toast", defaultToastConfig);
