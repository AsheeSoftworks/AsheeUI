/**
 * The Toast system's configuration face, shared by both platforms.
 *
 * A toast is a message that appears above what the reader is doing and goes away by
 * itself. Both platforms ask it the same questions: where it appears, how big it is,
 * how it is drawn, whether it animates, how long it waits before leaving, how many may
 * be queued, and what a message looks like. Those are named here, once, so
 * `components.toast` is configured the same way in a web application and in a native
 * one.
 *
 * The queue's patience is stated here rather than in each renderer: how long a message
 * waits before dismissing itself, and how many messages may wait at once, are decisions
 * about the reader's attention rather than about a platform, and two renderers that
 * disagreed about them would be two products.
 *
 * What stays with each renderer is the mechanism: the web renders its messages through
 * a portal into the document, and the platform has no document, so it draws them in an
 * overlay of its own. That is why the `portal` option is named here and read by the
 * web alone — a native configuration of `components.toast` is the same configuration
 * without an option that could not mean anything there.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `toast` here is what makes `components.toast` a known
 * configuration section without either renderer restating it.
 */

import type { ReactNode } from "react";
import type { Radius, Size } from "../../shared/radius";
import type { Variant } from "../../shared/variant";

/**
 * Type of toast notification.
 * Determines the icon and the colour role the message is presented in.
 */
export type ToastType = "success" | "error" | "info" | "warning" | "default";

/**
 * Placement of the toast container on the screen.
 * Controls where messages appear and, on the web, which way they animate from.
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
  /** Unique identifier for the toast. */
  id: string;

  /** Optional title text, displayed above the message. */
  title?: ReactNode;

  /** The main message content. */
  message: ReactNode;

  /** Type of toast, which controls its icon and colour. @default "info" */
  type?: ToastType;

  /**
   * Duration in milliseconds before auto-dismissal.
   * Set to zero or less to keep the message until it is dismissed.
   *
   * @default 3500
   */
  timeout?: number;

  /** Custom icon element, overriding the default one for the type. */
  icon?: ReactNode;

  /** Action element rendered below the message. */
  action?: ReactNode;

  /** Whether the reader can dismiss the message. @default true */
  dismissible?: boolean;

  /** Placement for this message, overriding the provider's. */
  placement?: ToastPlacement;

  /** Density for this message, overriding the provider's. */
  size?: Size;

  /** Treatment for this message, overriding the provider's. */
  variant?: Variant;

  /** Corner rounding for this message, overriding the provider's. */
  radius?: Radius;

  /** Whether this message animates, overriding the provider's. */
  animated?: boolean;
}

/**
 * Options for showing a toast notification.
 */
export interface ToastShowOptions extends Omit<ToastItemData, "id"> {
  /** Optional unique identifier. One is generated when it is not stated. */
  id?: string;
}

/**
 * Configuration options for the Toast system.
 *
 * Set under `components.toast` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface ToastConfig {
  /** Size scale of toast notifications. @default "md" */
  size?: Size;

  /** Placement of the toast container. @default "top-right" */
  placement?: ToastPlacement;

  /** Visual style variant of toasts. @default "bordered" */
  variant?: Variant;

  /** Corner rounding of toast notifications. @default "md" */
  radius?: Radius;

  /** Whether toasts have enter and exit animations. @default true */
  animated?: boolean;

  /**
   * Default timeout duration in milliseconds, used when a toast does not state its
   * own.
   *
   * @default 3500
   */
  defaultTimeout?: number;

  /**
   * Maximum number of toasts to display at once.
   * Older messages are removed when this limit is exceeded.
   *
   * @default 5
   */
  maxToasts?: number;

  /**
   * Whether to render toasts in a portal.
   *
   * The web renders them at the document body level, which escapes CSS containment
   * and stacking contexts. The platform has no document, so it has no equivalent and
   * a native configuration leaves this option out.
   *
   * @default true
   */
  portal?: boolean;
}

/**
 * How long a message waits before dismissing itself when nothing states otherwise.
 *
 * It is stated once and read by both renderers, so a toast is on a screen for the same
 * length of time on either platform.
 */
export const TOAST_FALLBACK_TIMEOUT_MS = 3500;

/**
 * How many messages may wait at once when nothing states otherwise.
 *
 * A queue deeper than a reader can read is a queue that hides messages, so the limit
 * is part of the system's contract rather than of a renderer.
 */
export const TOAST_FALLBACK_MAX_TOASTS = 5;

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    toast: ToastConfig;
  }
}
