/**
 * The FeatureGrid's configuration face, shared by both platforms.
 *
 * A feature grid is a heading and a responsive grid of feature cards. Both platforms ask it
 * the same questions: the band options every band shares (stated once in
 * `shared/section-block`), the column count at each of the framework's breakpoints, and the
 * space between the cards. The list of features itself is described here too, because the
 * two renderers read one description of a feature rather than two.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `featuregrid` here is what makes `components.featuregrid` a known
 * configuration section without either renderer restating it.
 */

import type { ReactNode } from "react";
import type { GridColumns } from "../../../shared/grid";
import type { SectionBlockOptions } from "../../../shared/section-block";
import type { Space } from "../../../shared/spacing";

/**
 * One feature in the grid.
 *
 * A feature is data rather than an element, so a band can be described by a configuration
 * file or a visual builder as well as by hand, which is the same rule the framework's
 * configured actions follow.
 */
export interface FeatureItem {
  /**
   * Stable identifier for the feature.
   * Defaults to its position in the list.
   */
  id?: string | number | undefined;

  /**
   * Icon shown above the feature title.
   */
  icon?: ReactNode | undefined;

  /**
   * Name of the feature.
   */
  title: ReactNode;

  /**
   * Explanation of the feature.
   */
  description?: ReactNode | undefined;

  /**
   * Destination of the feature.
   * With one, the whole card becomes a control; without one, the card is a surface.
   */
  href?: string | undefined;
}

/**
 * Configuration options for the FeatureGrid.
 *
 * Set under `components.featuregrid` in the AsheeUI config. Values feed the component-level
 * fallback tier of the theme cascade.
 */
export interface FeatureGridConfig extends SectionBlockOptions {
  /** Columns from the smallest window upwards. */
  columns?: GridColumns | undefined;

  /** Columns from the `md` breakpoint upwards. */
  columnsMd?: GridColumns | undefined;

  /** Columns from the `lg` breakpoint upwards. */
  columnsLg?: GridColumns | undefined;

  /** Space between the feature cards. */
  gap?: Space | undefined;
}

declare module "../../../registry" {
  interface ComponentTypeConfigRegistry {
    featuregrid: FeatureGridConfig;
  }
}
