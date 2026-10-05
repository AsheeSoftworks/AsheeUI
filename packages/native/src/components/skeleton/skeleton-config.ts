/**
 * Skeleton configuration for the native package.
 *
 * The options are the ones the framework's skeleton contract names, and both of them
 * are implemented here: a placeholder has corners on this platform for the same
 * reason it has them on the web, and it breathes there for the same reason too,
 * through the platform's own animator rather than through a class the platform would
 * never run.
 *
 * The differences between the two renderers are in the *values* rather than in the
 * shape, and they live in `defaultNativeSkeletonConfig`.
 */

import type { SkeletonConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

/**
 * Configuration options for the native Skeleton.
 *
 * `radius` and `isAnimated` carry the meanings the shared skeleton contract gives
 * them.
 */
export type NativeSkeletonConfig = Pick<
  SkeletonConfig,
  "radius" | "isAnimated"
>;

/**
 * The defaults the Skeleton registers with the native registry.
 *
 * The radius is `sm`, because a placeholder most often stands in for a line of text,
 * and it is animated, because a placeholder that breathes reads as waiting rather
 * than as broken.
 */
export const defaultNativeSkeletonConfig: NativeSkeletonConfig = {
  radius: "sm",
  isAnimated: true,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    skeleton: NativeSkeletonConfig;
  }
}

registerNativeComponentDefaults("skeleton", defaultNativeSkeletonConfig);

/**
 * The values the placeholder falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_SKELETON_CONFIG: Required<NativeSkeletonConfig> = {
  radius: "sm",
  isAnimated: true,
};
