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
 * and the platform states the same decision as the length of its long press. Both halves of the
 * wait are shared too: the platform keeps the hint up for `close` after the press ends, exactly
 * as the web keeps it up for `close` after the pointer leaves.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type augmentation:
 * declaring `tooltip` here is what makes `components.tooltip` a known configuration section
 * without either renderer restating it.
 */

import type { Radius, Size } from "../../../shared/radius";
import type { Color, Variant } from "../../../shared/variant";

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
  /**
   * Visual style variant.
   *
   * It is the last tier of the cascade rather than the first: the application's
   * `defaultVariant` resolves before it, so a theme that names a treatment — the shipped
   * one is `"faded"` — overrides this fallback.
   *
   * @default "solid"
   */
  variant?: Variant | undefined;

  /**
   * Colour role of the surface.
   *
   * Resolved the same way as `variant`: the application's `defaultColor` answers before
   * this fallback, which is why an unconfigured application renders `"primary"`.
   *
   * @default "secondary"
   */
  color?: Color | undefined;

  /** Size of the hint, which decides its padding and its type. @default "md" */
  size?: TooltipSizeKey | undefined;

  /** Where the hint sits relative to its trigger. @default "top" */
  placement?: TooltipPlacement | undefined;

  /**
   * How long the reader has to rest on the trigger before the hint appears, and how long it
   * stays once they have stopped, in milliseconds. A number states both halves of the wait.
   *
   * The object form states them apart. `open` is the rest — on the web, how long the pointer
   * rests on the trigger; on a device, how long the long press is held — so a longer `open`
   * asks the reader to stop before the hint appears. `close` is how much longer the hint stays
   * after the pointer leaves or the press ends, so moving between two adjacent triggers does
   * not blink it out and back in. An object that states only `open` closes immediately, which
   * is how the web has always read one, and the platform reads it the same way.
   *
   * @default 200
   */
  delay?: number | { open?: number; close?: number } | undefined;

  /** The distance between the hint and its trigger, in points. @default 8 */
  offset?: number | undefined;

  /**
   * Corner rounding of the hint.
   *
   * Also unregistered, so the application's `defaultRadius` resolves before it: a theme
   * that states a rounding — `"xs"` is what ships — overrides this fallback.
   *
   * @default "md"
   */
  radius?: Radius | undefined;

  /** Whether the hint shows a pointer towards its trigger. @default false */
  showArrow?: boolean | undefined;

  /**
   * Whether the web renders the hint through a portal.
   * The platform has no document to render into, so a native configuration leaves this out.
   *
   * @default false
   */
  portal?: boolean | undefined;

  /**
   * The layer the web places the hint on.
   * A layer is a document concept, so a native configuration leaves this out.
   *
   * @default ASHEE_LAYER.tooltip (30)
   */
  zIndex?: number | undefined;

  /**
   * Extra classes applied to every hint.
   *
   * @default ""
   */
  className?: string | undefined;
}

declare module "../../../registry" {
  interface ComponentTypeConfigRegistry {
    tooltip: TooltipConfig;
  }
}
