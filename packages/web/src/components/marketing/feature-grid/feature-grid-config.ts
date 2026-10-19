/**
 * FeatureGrid component configuration for AsheeUI.
 *
 * This file registers the values the FeatureGrid defaults to on the web, so the
 * component-level fallback tier of the theme cascade has a value to resolve. The options
 * themselves, and the types that name them, live in `@asheeui/core`: they are the framework's
 * feature-grid contract rather than a web renderer's, and the native renderer reads the same
 * ones from the same place. What stays here is the web default values and the registration
 * that puts them in the web registry.
 */

import {
  type FeatureGridConfig,
  registerComponentDefaults,
} from "@asheeui/core";

export type { FeatureGridConfig, FeatureItem } from "@asheeui/core";

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
