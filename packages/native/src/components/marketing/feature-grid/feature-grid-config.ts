/**
 * FeatureGrid component configuration for the native package.
 *
 * The options are the ones the framework's feature-grid contract names, so
 * `components.featuregrid` is configured the same way on both platforms, and the type
 * is re-exported from `@asheeui/core` rather than restated here. What stays with the
 * renderer is the value each option defaults to on the platform, and the registration
 * that puts it in the native registry.
 */

import type { FeatureGridConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../../config/registry";

export type { FeatureGridConfig, FeatureItem } from "@asheeui/core";

/**
 * Configuration options for the native FeatureGrid.
 *
 * @deprecated Use {@link FeatureGridConfig} from `@asheeui/core` — the name both renderers
 * publish.
 */
export type NativeFeatureGridConfig = FeatureGridConfig;

/**
 * The defaults the FeatureGrid registers with the native registry.
 *
 * They are the web's own values, because a deck of features is read the same way on
 * either platform: one column where there is no room, two on a tablet and three on a
 * wide window. The platform resolves the window itself rather than a stylesheet, which
 * is what makes the same numbers mean the same thing here.
 *
 * @deprecated Use {@link defaultFeatureGridConfig} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const defaultNativeFeatureGridConfig: NativeFeatureGridConfig = {
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

declare module "../../../config/registry" {
  interface NativeComponentConfigRegistry {
    featuregrid: NativeFeatureGridConfig;
  }
}

registerNativeComponentDefaults("featuregrid", defaultNativeFeatureGridConfig);

/**
 * The values the grid falls back to when no tier provides one.
 *
 * @deprecated Use {@link FALLBACK_FEATURE_GRID_CONFIG} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const FALLBACK_NATIVE_FEATURE_GRID_CONFIG = {
  columns: 1,
  columnsMd: 2,
  columnsLg: 3,
  gap: "lg",
  spacing: "lg",
  background: "none",
  align: "center",
  containerSize: "lg",
  contained: true,
} satisfies NativeFeatureGridConfig;
