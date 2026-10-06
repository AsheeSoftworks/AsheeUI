/**
 * The Navbar's configuration face, shared by both platforms.
 *
 * A navigation bar is a banner with a brand, a set of destinations and an action region, and both
 * platforms ask it the same questions: how it behaves when the page scrolls, how its surface is
 * treated, where its destinations sit and how wide its content may grow. Those are named here,
 * once, so `components.navbar` means the same thing in a web application and in a native one.
 *
 * The destinations are described here too, because the two renderers read one description of a
 * destination rather than two.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type augmentation:
 * declaring `navbar` here is what makes `components.navbar` a known configuration section, on
 * every platform, without each renderer restating it.
 */

import type { ElementType, ReactNode } from "react";
import type { ContainerSize } from "../../shared/section-block";

/**
 * How the bar behaves when the page scrolls.
 *
 * - `static`: the bar scrolls away with the page.
 * - `sticky`: the bar stays at the top of the viewport.
 *
 * The platform has no scroll-linked positioning, so it pins a bar by placing it outside the
 * region that scrolls: the option resolves through the shared contract and changes no class.
 */
export type NavbarPosition = "static" | "sticky";

/**
 * Surface treatment of the bar.
 *
 * - `solid`: the page background, so the bar reads as part of the page.
 * - `ghost`: transparent, so the bar sits on a hero without adding a band.
 * - `bordered`: the page background with a separator below it.
 */
export type NavbarVariant = "solid" | "ghost" | "bordered";

/**
 * Where the destinations sit in the bar.
 *
 * The web states the position inside a bar that has the room for it; the platform states it inside
 * the row of destinations, which is as wide as the bar leaves it.
 */
export type NavbarAlign = "start" | "center" | "end";

/**
 * One destination in the bar.
 */
export interface NavbarLinkItem {
  /** Stable identifier for the destination. Defaults to its position in the list. */
  id?: string | number;

  /** Visible name of the destination, and the accessible name of its control. */
  label: ReactNode;

  /** Destination of the link. */
  href?: string;

  /**
   * Whether this destination leads to the page currently shown.
   *
   * The web marks it `aria-current="page"`, which is what tells assistive technology where the
   * reader is; the platform states the same thing as the control's selected state. Both add an
   * emphasis for the eye.
   */
  isActive?: boolean;

  /** Content before the label, typically an icon. */
  icon?: ReactNode;

  /** Component that replaces the framework's own element for this destination. */
  component?: ElementType;

  /** Additional props for that component. */
  componentProps?: Record<string, unknown>;

  /** Whether the destination is unavailable. */
  disabled?: boolean;
}

/**
 * Substitution applied to every destination in the bar.
 */
export interface NavbarLink {
  /** Component that replaces the framework's own element. */
  component?: ElementType;

  /** Additional props for that component. */
  props?: Record<string, unknown>;
}

/**
 * Theme configuration options for the Navbar component.
 *
 * Set under `components.navbar` in the AsheeUI config. Values feed the component-level tier of the
 * theme cascade.
 */
export interface NavbarConfig {
  /**
   * How the bar behaves when the page scrolls.
   *
   * @default "sticky"
   */
  position?: NavbarPosition;

  /**
   * Surface treatment of the bar.
   *
   * @default "solid"
   */
  variant?: NavbarVariant;

  /**
   * Where the destinations sit.
   *
   * @default "start"
   */
  align?: NavbarAlign;

  /**
   * Whether the bar wraps its content in a `Container`.
   *
   * @default true
   */
  contained?: boolean;

  /**
   * Maximum content width of the bar.
   *
   * @default "lg"
   */
  containerSize?: ContainerSize;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    navbar: NavbarConfig;
  }
}
