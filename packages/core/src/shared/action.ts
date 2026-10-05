/**
 * Configured action definitions for AsheeUI.
 *
 * This file defines the serializable description of a call to action that the
 * framework's patterns accept. A pattern (a hero, a call to action, an empty
 * state, a pricing card) takes actions as configuration rather than as React
 * elements, which keeps the pattern's own layout in charge, keeps its props
 * serializable for a visual builder, and leaves `children` free for whatever
 * else the consumer needs to place.
 */

import type { ElementType, ReactNode } from "react";
import type { Radius, Size } from "./radius";
import type { Color, Variant } from "./variant";

/**
 * A call to action described as configuration.
 *
 * Every field maps to a prop of {@link Button}, so a configured action renders
 * exactly like an action the consumer wrote by hand. `label` is the only
 * required field: an action without a name cannot be read or clicked.
 */
export interface ActionConfig {
  /**
   * Visible name of the action, and the accessible name of its control.
   */
  label: ReactNode;

  /**
   * Destination of the action.
   * With one, the action renders as a link; without one, as a button.
   */
  href?: string;

  /**
   * Visual style of the action.
   * Defaults to the emphasis the pattern gives that position: the primary
   * action is solid and the secondary action is bordered.
   */
  variant?: Variant;

  /**
   * Accent colour of the action.
   */
  color?: Color;

  /**
   * Density of the action.
   */
  size?: Size;

  /**
   * Corner rounding of the action.
   */
  radius?: Radius;

  /**
   * Content before the label, typically an icon.
   */
  icon?: ReactNode;

  /**
   * Component that replaces the anchor, such as a framework router link.
   */
  component?: ElementType;

  /**
   * Props for that component.
   */
  componentProps?: Record<string, unknown>;
}
