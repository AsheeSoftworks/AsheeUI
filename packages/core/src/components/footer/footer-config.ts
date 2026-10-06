/**
 * The Footer's configuration face, shared by both platforms.
 *
 * A footer is the last band of a page: a brand column, navigation groups, social links,
 * legal links and a copyright line. It is a band, but it does not take the band options
 * every other band takes — a footer is never centred and it paints its own surface rather
 * than choosing where the page background shows through — so it states the two options it
 * does share (its rhythm and its container) and the one that is its own (its surface).
 *
 * The links are described here rather than by either renderer, because the two read one
 * description of a link. Two of its fields are read by the web alone, and the module says so
 * rather than pretending otherwise: `component` and `componentProps` replace an anchor with
 * a framework's router link, and the platform has no anchor to replace — it hands a
 * destination to the platform's own URL handler.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `footer` here is what makes `components.footer` a known
 * configuration section without either renderer restating it.
 */

import type { ElementType, ReactNode } from "react";
import type { ContainerSize } from "../../shared/section-block";
import type { Space } from "../../shared/spacing";

/**
 * Surface treatment of the footer.
 *
 * - `solid`: the page background, so the footer reads as part of the page.
 * - `muted`: a subdued band.
 * - `bordered`: the page background with a separator above it.
 */
export type FooterVariant = "solid" | "muted" | "bordered";

/**
 * One link in the footer.
 */
export interface FooterLinkItem {
  /** Stable identifier for the link. Defaults to its position in the list. */
  id?: string | number;

  /** Visible name of the link, and the accessible name of its control. */
  label: ReactNode;

  /** Destination of the link. */
  href?: string;

  /** Content before the label, typically an icon or a social mark. */
  icon?: ReactNode;

  /** Whether the link leaves the site, which the web marks on the anchor. */
  isExternal?: boolean;

  /** Component that replaces the anchor for this link only. Read by the web alone. */
  component?: ElementType;

  /** Additional props for that component. Read by the web alone. */
  componentProps?: Record<string, unknown>;
}

/**
 * One column of footer navigation.
 */
export interface FooterGroup {
  /** Stable identifier for the group. Defaults to its position in the list. */
  id?: string | number;

  /** Title of the column, which also names its navigation landmark. */
  title: string;

  /** The links in the column. */
  links: FooterLinkItem[];
}

/**
 * Configuration options for the Footer.
 *
 * Set under `components.footer` in the AsheeUI config. Values feed the component-level
 * fallback tier of the theme cascade.
 */
export interface FooterConfig {
  /** Surface treatment. */
  variant?: FooterVariant;

  /** Vertical padding of the footer. */
  spacing?: Space;

  /** Whether the footer wraps its content in a container, so the framework's maximum width and gutter apply. */
  contained?: boolean;

  /** Maximum content width. */
  containerSize?: ContainerSize;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    footer: FooterConfig;
  }
}
