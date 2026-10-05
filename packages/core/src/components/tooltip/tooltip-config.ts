/**
 * The Tooltip's configuration face, shared by both platforms.
 *
 * A tooltip is a short explanation of something the reader is pointing at, and both platforms
 * ask it the same questions: how it is drawn, in which colour, how large it is, where it sits
 * relative to its trigger, how round its corners are, whether it has a pointer, and how long it
 * waits before appearing. Those are named here, once, so `components.tooltip` means the same
 * thing in a web application and in a native one.
 *
 * Two options are named here and read by the web alone, and the module says so rather than
 * pretending otherwise: `portal` and `zIndex` are about where a layer sits in a document, and
 * the platform has no document. What replaces them there is the platform's own layer order,
 * which the framework does not choose.
 *
 * How the hint appears is the platform's: the web shows it while a pointer rests on the trigger
 * or the trigger has the keyboard, and the platform shows it on a **long press**, because there
 * is no pointer to rest anywhere. That is why `delay` is shared rather than web-only — how long
 * a reader has to rest on the trigger before the hint appears is a decision about the reader,
 * and the platform states the same decision as the length of its long press.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type augmentation:
 * declaring `tooltip` here is what makes `components.tooltip` a known configuration section
 * without either renderer restating it.
 */

import type { Radius, Size } from "../shared/radius";
import type { Color, Variant } from "../shared/variant";

/**
 * Where the tooltip sits relative to its trigger.
 *
 * The three forms of each side are the side itself, and the side aligned to the start or the end
 * of the trigger. Both platforms read all twelve; the platform reads a side placement as the
 * vertical direction the hint belongs in, because a hint beside a control has nowhere to be on
 * a screen a thumb is already holding.
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
 * How large the tooltip is.
 */
export type TooltipSizeKey = Size;

/**
 * Configuration options for the Tooltip.
 *
 * Set under `components.tooltip` in the AsheeUI config. Values feed the component-level fallback
 * tier of the theme cascade.
 */
export interface TooltipConfig {
  /** Visual style variant. @default "solid" */
  variant?: Variant;

  /** Colour role of the surface. @default "secondary" */
  color?: Color;

  /** Size of the hint, which decides its padding and its type. @default "md" */
  size?: TooltipSizeKey;

  /** Where the hint sits relative to its trigger. @default "top" */
  placement?: TooltipPlacement;

  /**
   * How long the reader has to rest on the trigger before the hint appears, in milliseconds.
   * A number states both the opening and the closing delay.
   *
   * @default 200
   */
  delay?: number | { open?: number; close?: number };

  /** The distance between the hint and its trigger, in points. @default 8 */
  offset?: number;

  /** Corner rounding of the hint. @default "md" */
  radius?: Radius;

  /** Whether the hint shows a pointer towards its trigger. @default false */
  showArrow?: boolean;

  /**
   * Whether the web renders the hint through a portal.
   * The platform has no document to render into, so a native configuration leaves this out.
   *
   * @default false
   */
  portal?: boolean;

  /**
   * The layer the web places the hint on.
   * A layer is a document concept, so a native configuration leaves this out.
   */
  zIndex?: number;

  /**
   * Extra classes applied to every hint.
   *
   * @default ""
   */
  className?: string;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    tooltip: TooltipConfig;
  }
}
