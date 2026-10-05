/**
 * The Tabs' configuration face, shared by both platforms.
 *
 * A tab bar is a list of destinations in one region, and both platforms ask it the same
 * questions: how tall a trigger is, how the bar is drawn, how round the bar is, and how a
 * selected trigger differs from an unselected one. Those are named here, once, so
 * `components.tabs` means the same thing in a web application and in a native one.
 *
 * The item shape is shared for the same reason: what a tab *is* — an identifier, a label,
 * an optional icon, an optional badge, its content, and whether it can be selected — is a
 * statement about the component rather than about a platform.
 *
 * What each renderer does with the bar is its own: the web moves focus between triggers
 * with the arrow keys and marks the bar with a tablist role, and the platform scrolls a
 * bar that does not fit and lets its own screen-reader gestures move between triggers.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `tabs` here is what makes `components.tabs` a known
 * configuration section without either renderer restating it.
 */

import type { ReactNode } from "react";
import type { Radius, Size } from "../shared/radius";
import type { Color, Variant } from "../shared/variant";

/**
 * Visual style variant of the tabs.
 *
 * - `underline`: the selected trigger is underlined, which is what a section of a page
 *   usually wants.
 * - `bordered`: the triggers sit in one outlined container.
 * - `ghost`: the triggers have no container of their own.
 */
export type TabsVariant = "underline" | "bordered" | "ghost";

/**
 * A single tab.
 */
export interface TabItem {
  /** Unique identifier for the tab. */
  id: string | number;

  /** Primary display text. */
  label?: ReactNode;

  /** Legacy display text, kept for compatibility with the `name` prop. */
  name?: ReactNode;

  /** Content shown before the label. */
  icon?: ReactNode;

  /** Content shown after the label, typically a count or a status. */
  badge?: ReactNode;

  /** The panel this tab reveals when it is selected. */
  content?: ReactNode;

  /**
   * Whether the tab can be selected.
   *
   * @default false
   */
  disabled?: boolean;

  /** Treatment of this trigger while it is selected, overriding the component's. */
  activeVariant?: Variant;

  /** Colour role of this trigger while it is selected, overriding the component's. */
  activeColor?: Color;

  /** Additional tab metadata. */
  [key: string]: unknown;
}

/** Visual styling of a selected trigger. */
export interface TabsActiveOptionConfig {
  radius?: Radius;
  variant?: Variant;
  color?: Color;
}

/** Visual styling of an unselected trigger. */
export interface TabsInactiveOptionConfig {
  radius?: Radius;
  variant?: Variant;
  color?: Color;
}

/** The styling of both states of a trigger. */
export interface TabsOptionsConfig {
  active?: TabsActiveOptionConfig;
  inactive?: TabsInactiveOptionConfig;
}

/**
 * Configuration options for the Tabs.
 *
 * Set under `components.tabs` in the AsheeUI config. Values feed the component-level
 * fallback tier of the theme cascade.
 */
export interface TabsConfig {
  /**
   * Density of the triggers.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * Visual style variant of the bar.
   *
   * @default "underline"
   */
  variant?: TabsVariant;

  /**
   * Corner rounding of the bar.
   *
   * @default "md"
   */
  radius?: Radius;

  /** Styling of a selected and an unselected trigger. */
  options?: TabsOptionsConfig;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    tabs: TabsConfig;
  }
}
