/**
 * Skeleton configuration for the web renderer.
 *
 * The options are the ones the framework's skeleton contract names, so
 * `components.skeleton` is configured the same way in both packages, and the type is
 * re-exported from `@asheeui/core` rather than restated here. What stays with the
 * renderer is the value each option defaults to on the web, and the registration that
 * puts it in the component registry.
 */

import { registerComponentDefaults, type SkeletonConfig } from "@asheeui/core";

export type { SkeletonConfig } from "@asheeui/core";

/**
 * Default config values registered for the Skeleton component.
 *
 * `radius` is registered, so it is pinned: a skeleton placeholder draws the shape
 * of the content it stands in for, so the application's `defaultRadius` does not
 * reach it. State `components.skeleton.radius` or the instance prop instead.
 */
export const defaultSkeletonConfig: SkeletonConfig = {
  radius: "sm",
  isAnimated: true,
};

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_SKELETON_CONFIG = {
  radius: "sm",
  isAnimated: true,
} as const satisfies SkeletonConfig;

registerComponentDefaults("skeleton", defaultSkeletonConfig);
