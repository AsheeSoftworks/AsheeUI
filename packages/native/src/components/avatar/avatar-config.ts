/**
 * Avatar component configuration for the native package.
 *
 * The options are the ones the framework's avatar contract names, so `components.avatar`
 * is configured the same way on both platforms, and the type is re-exported from
 * `@asheeui/core` rather than restated here. What stays with the renderer is the value
 * each option defaults to on the platform, and the registration that puts it in the
 * native registry.
 */

import type { AvatarConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

export type { AvatarConfig } from "@asheeui/core";

/**
 * Configuration options for the native Avatar.
 */
export type NativeAvatarConfig = AvatarConfig;

/**
 * The defaults the Avatar registers with the native registry.
 *
 * They are the web's own values: an avatar is a circle at medium diameter on both
 * platforms. `color` is absent on purpose, so it inherits from the platform's default
 * colour instead of pinning itself here.
 */
export const defaultNativeAvatarConfig: NativeAvatarConfig = {
  size: "md",
  radius: "full",
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    avatar: NativeAvatarConfig;
  }
}

registerNativeComponentDefaults("avatar", defaultNativeAvatarConfig);

/**
 * The values the avatar falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_AVATAR_CONFIG: Required<NativeAvatarConfig> = {
  size: "md",
  radius: "full",
  color: "primary",
};
