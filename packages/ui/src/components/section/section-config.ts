/**
 * Section component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the Section layout
 * component: vertical rhythm, background treatment, optional container and
 * divider. It registers the default configuration with the component registry
 * and provides fallback values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Space } from "../../shared";
import type { ContainerSize } from "../container/container-config";

/**
 * Background treatment of a section.
 *
 * - `none`: transparent, so the page background shows through.
 * - `muted`: a subdued band, used to separate one section from the next.
 * - `tinted`: a faint accent band, used to emphasise a section.
 */
export type SectionBackground = "none" | "muted" | "tinted";

/**
 * Theme configuration options for the Section component.
 *
 * Set under `components.section` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface SectionConfig {
  /**
   * Vertical padding of the section.
   *
   * @default "lg"
   */
  spacing?: Space;

  /**
   * Background treatment.
   *
   * @default "none"
   */
  background?: SectionBackground;

  /**
   * Whether the section wraps its children in a {@link Container}.
   * Off by default, so a section can be composed with any other layout
   * element. On, the section owns the maximum width and the gutter.
   *
   * @default false
   */
  contained?: boolean;

  /**
   * Maximum content width used when the section is contained.
   *
   * @default "lg"
   */
  containerSize?: ContainerSize;

  /**
   * Whether to draw a separator line above the section.
   *
   * @default false
   */
  divider?: boolean;
}

/**
 * Default config values registered for the Section component.
 */
export const defaultSectionConfig: SectionConfig = {
  spacing: "lg",
  background: "none",
  contained: false,
  containerSize: "lg",
  divider: false,
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    section: SectionConfig;
  }
}

registerComponentDefaults("section", defaultSectionConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_SECTION_CONFIG: Required<SectionConfig> = {
  spacing: "lg",
  background: "none",
  contained: false,
  containerSize: "lg",
  divider: false,
};
