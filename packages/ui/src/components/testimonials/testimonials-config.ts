/**
 * Testimonials component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the Testimonials
 * pattern: grid columns per breakpoint, gap, rhythm, background and content
 * width. It registers the default configuration with the component registry and
 * provides fallback values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Space } from "../../shared";
import type { ContainerSize } from "../container/container-config";
import type { GridColumns } from "../grid/grid-config";
import type { SectionBackground } from "../section/section-config";

/**
 * Theme configuration options for the Testimonials component.
 *
 * Set under `components.testimonials` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface TestimonialsConfig {
  /** Columns from the smallest viewport upwards. @default 1 */
  columns?: GridColumns;

  /** Columns from the `md` breakpoint upwards. @default 2 */
  columnsMd?: GridColumns;

  /** Columns from the `lg` breakpoint upwards. @default 3 */
  columnsLg?: GridColumns;

  /** Space between the quotes. @default "lg" */
  gap?: Space;

  /** Vertical padding of the band. @default "lg" */
  spacing?: Space;

  /** Background treatment of the band. @default "none" */
  background?: SectionBackground;

  /** Alignment of the heading above the quotes. @default "center" */
  align?: "start" | "center";

  /** Maximum content width of the band. @default "lg" */
  containerSize?: ContainerSize;

  /** Whether the band wraps its content in a `Container`. @default true */
  contained?: boolean;
}

/**
 * Default config values registered for the Testimonials component.
 */
export const defaultTestimonialsConfig: TestimonialsConfig = {
  columns: 1,
  columnsMd: 2,
  columnsLg: 3,
  gap: "lg",
  spacing: "lg",
  background: "none",
  align: "center",
  containerSize: "lg",
  contained: true,
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    testimonials: TestimonialsConfig;
  }
}

registerComponentDefaults("testimonials", defaultTestimonialsConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_TESTIMONIALS_CONFIG: Required<TestimonialsConfig> = {
  columns: 1,
  columnsMd: 2,
  columnsLg: 3,
  gap: "lg",
  spacing: "lg",
  background: "none",
  align: "center",
  containerSize: "lg",
  contained: true,
};
