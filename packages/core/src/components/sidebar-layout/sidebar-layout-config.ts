/**
 * The SidebarLayout's configuration face, shared by both platforms.
 *
 * An application shell with a navigation column states three things about itself: which side the
 * column sits on, how wide it is and whether it stays in view while the content scrolls. Those
 * are named here, once, so `components.sidebarlayout` means the same thing in a web application
 * and in a native one.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type augmentation:
 * declaring `sidebarlayout` here is what makes `components.sidebarlayout` a known configuration
 * section, on every platform, without each renderer restating it.
 */

/**
 * Side the navigation column sits on.
 *
 * The web states the side from the `lg` breakpoint upwards, where the shell becomes two columns;
 * the platform stacks the column above the content or draws it behind a control, because a
 * phone has no room beside the content, so the side decides the order the column is placed in.
 */
export type SidebarLayoutSide = "start" | "end";

/**
 * Width of the navigation column.
 *
 * The web states the width from the `lg` breakpoint upwards. The platform has no column to
 * measure once the navigation is drawn rather than placed, so the width resolves through the
 * contract and decides the width of a drawn navigation too — a sheet is as wide as its size
 * says, and the width names how much of the content the column keeps beside it.
 */
export type SidebarLayoutWidth = "sm" | "md" | "lg";

/**
 * Theme configuration options for the SidebarLayout component.
 *
 * Set under `components.sidebarlayout` in the AsheeUI config. Values feed the component-level
 * tier of the theme cascade.
 */
export interface SidebarLayoutConfig {
  /**
   * Side the navigation column sits on.
   *
   * @default "start"
   */
  side?: SidebarLayoutSide;

  /**
   * Width of the navigation column.
   *
   * @default "md"
   */
  sidebarWidth?: SidebarLayoutWidth;

  /**
   * Whether the navigation column stays in view while the content scrolls.
   * Applies from the `lg` breakpoint upwards, where the column sits beside the content rather
   * than above it.
   *
   * @default true
   */
  stickySidebar?: boolean;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    sidebarlayout: SidebarLayoutConfig;
  }
}
