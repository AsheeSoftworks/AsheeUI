/**
 * The Sidebar's configuration face, shared by both platforms.
 *
 * A sidebar is a vertical navigation list that can be collapsed, and both platforms ask it the
 * same questions: how large its rows are, how it is drawn, how round its corners are, how its
 * active and inactive items are treated, what a collapsed item says when it is asked, and whether
 * it can be collapsed at all. Those are named here, once, so `components.sidebar` means the same
 * thing in a web application and in a native one.
 *
 * The items are described here too, because the two renderers read one description of a
 * navigation item rather than two: a destination is data — an identifier, a label, an optional
 * icon, an optional badge and the roles it is shown to — and both platforms read the same data.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type augmentation:
 * declaring `sidebar` here is what makes `components.sidebar` a known configuration section, on
 * every platform, without each renderer restating it.
 */

import type { ElementType, ReactNode } from "react";
import type { Radius, Size } from "../../../shared/radius";
import type { Color, Variant } from "../../../shared/variant";
import type { TooltipPlacement } from "../../overlays/tooltip/tooltip-config";

/**
 * Size key for the sidebar.
 * Controls the width of the sidebar when expanded and collapsed.
 */
export type SidebarSizeKey = Size;

/**
 * Visual style variant of the sidebar.
 * - `default`: standard sidebar with a border and a background.
 * - `bordered`: sidebar with a thicker border.
 * - `floating`: sidebar with rounded corners and a shadow.
 * - `ghost`: minimal sidebar with a background only, no border.
 */
export type SidebarVariant = "default" | "bordered" | "floating" | "ghost";

/**
 * One navigation item in the sidebar.
 */
export interface SidebarItem<T = string> {
  /** Unique item identifier. */
  id: T;

  /** Display label or title. */
  label: ReactNode;

  /** Destination of the item. */
  href?: string | undefined;

  /** Leading icon element. */
  icon?: ReactNode | undefined;

  /** Optional trailing badge element or count. */
  badge?: ReactNode | undefined;

  /**
   * Roles the item is shown to.
   * When provided, the item is only shown to a reader whose role matches.
   */
  roles?: string[] | undefined;

  /**
   * Disables click interaction.
   *
   * @default false
   */
  disabled?: boolean | undefined;

  /** Target for the destination, such as `"_blank"`. Read by the web alone. */
  target?: string | undefined;

  /** Relationship of the destination. Read by the web alone. */
  rel?: string | undefined;
}

/**
 * A section containing several sidebar items.
 * It groups related destinations under a label.
 */
export interface SidebarSection<T = string> {
  /** Unique section identifier. */
  id: T;

  /** Display label, shown as a section header when the sidebar is expanded. */
  label?: ReactNode | undefined;

  /** The items within the section. */
  items?: SidebarItem<T>[] | undefined;

  /** Roles the section is shown to, in the same sense as an item's. */
  roles?: string[] | undefined;

  /**
   * Disables interaction for the whole section.
   *
   * @default false
   */
  disabled?: boolean | undefined;
}

/**
 * The sidebar's content: a flat list of items or a list of sections.
 */
export type SidebarItems<T = string> = SidebarItem<T>[] | SidebarSection<T>[];

/**
 * Visual styling of the active navigation item.
 */
export interface SidebarActiveOptionConfig {
  /** Visual variant of the active item. */
  variant?: Variant | undefined;

  /** Theme colour of the active item. */
  color?: Color | undefined;
}

/**
 * Visual styling of inactive navigation items.
 */
export interface SidebarInactiveOptionConfig {
  /** Visual variant of inactive items. */
  variant?: Variant | undefined;

  /** Theme colour of inactive items. */
  color?: Color | undefined;
}

/**
 * Options configuration for the sidebar's navigation items.
 */
export interface SidebarOptionsConfig {
  /** Corner rounding of individual navigation items. */
  radius?: Radius | undefined;

  /** Styling of the active navigation item. */
  active?: SidebarActiveOptionConfig | undefined;

  /** Styling of inactive navigation items. */
  inactive?: SidebarInactiveOptionConfig | undefined;
}

/**
 * What a collapsed item says when a reader asks about it.
 *
 * The web shows the hint while a pointer rests on the item; the platform shows it on a long press,
 * because there is no pointer to rest anywhere. The placement is the shared vocabulary, and the
 * platform reads a side placement as the vertical direction the hint belongs in, for the same
 * reason.
 */
export interface SidebarTooltipConfig {
  /**
   * Whether collapsed items explain themselves.
   *
   * @default true
   */
  show?: boolean | undefined;

  /**
   * Placement of the hint relative to the item.
   *
   * @default "right"
   */
  placement?: TooltipPlacement | undefined;

  /** Visual variant of the hint. */
  variant?: Variant | undefined;

  /** Theme colour of the hint. */
  color?: Color | undefined;
}

/**
 * Theme configuration options for the Sidebar component.
 *
 * Set under `components.sidebar` in the AsheeUI config. Values feed the component-level tier of
 * the theme cascade.
 */
export interface SidebarConfig {
  /**
   * Size scale of the sidebar.
   * It controls the width of the sidebar when expanded and collapsed.
   *
   * @default "md"
   */
  size?: SidebarSizeKey | undefined;

  /**
   * Visual style variant.
   *
   * @default "default"
   */
  variant?: SidebarVariant | undefined;

  /**
   * Corner rounding of the sidebar.
   */
  radius?: Radius | undefined;

  /**
   * How the sidebar's navigation items are treated.
   */
  options?: SidebarOptionsConfig | undefined;

  /**
   * What a collapsed item says when it is asked.
   */
  tooltip?: SidebarTooltipConfig | undefined;

  /**
   * Whether the collapse control is shown.
   *
   * @default true
   */
  showCollapseButton?: boolean | undefined;

  /**
   * Whether the sidebar moves when it is collapsed or expanded.
   *
   * The web states a width transition; the platform has no transition to declare in a class and
   * lays the new width out directly, so a native screen that wants movement supplies the
   * platform's own animation. The option resolves through the shared contract either way.
   *
   * @default true
   */
  animated?: boolean | undefined;

  /**
   * Initial collapsed state, for an uncontrolled sidebar.
   *
   * @default false
   */
  defaultCollapsed?: boolean | undefined;

  /**
   * Whether the sidebar can be collapsed.
   *
   * @default true
   */
  collapsible?: boolean | undefined;
}

/**
 * A link substitution, kept here because both renderers offer the same one: `component` names the
 * component that renders an item instead of the framework's own, and `props` carries the props it
 * needs. The web passes a router's link; the platform passes its navigation library's component,
 * which is the platform's own way of keeping an application's routing in the application.
 */
export interface SidebarLinkSubstitution {
  /** Component that replaces the framework's own element for every item. */
  component?: ElementType | undefined;

  /** Additional props for that component. */
  props?: Record<string, unknown> | undefined;
}

declare module "../../../registry" {
  interface ComponentTypeConfigRegistry {
    sidebar: SidebarConfig;
  }
}
