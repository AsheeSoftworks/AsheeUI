/**
 * FeatureGrid component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the FeatureGrid
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
 * Theme configuration options for the FeatureGrid component.
 *
 * Set under `components.featuregrid` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface FeatureGridConfig {
  /**
   * Columns from the smallest viewport upwards.
   *
   * @default 1
   */
  columns?: GridColumns;

  /**
   * Columns from the `md` breakpoint upwards.
   *
   * @default 2
   */
  columnsMd?: GridColumns;

  /**
   * Columns from the `lg` breakpoint upwards.
   *
   * @default 3
   */
  columnsLg?: GridColumns;

  /**
   * Space between the feature cards.
   *
   * @default "lg"
   */
  gap?: Space;

  /**
   * Vertical padding of the band.
   *
   * @default "lg"
   */
  spacing?: Space;

  /**
   * Background treatment of the band.
   *
   * @default "none"
   */
  background?: SectionBackground;

  /**
   * Alignment of the heading above the grid.
   *
   * @default "center"
   */
  align?: "start" | "center";

  /**
   * Maximum content width of the band.
   *
   * @default "lg"
   */
  containerSize?: ContainerSize;

  /**
   * Whether the band wraps its content in a {@link Container}.
   *
   * @default true
   */
  contained?: boolean;
}

/**
 * Default config values registered for the FeatureGrid component.
 */
export const defaultFeatureGridConfig: FeatureGridConfig = {
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
    featuregrid: FeatureGridConfig;
  }
}

registerComponentDefaults("featuregrid", defaultFeatureGridConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_FEATURE_GRID_CONFIG: Required<FeatureGridConfig> = {
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
