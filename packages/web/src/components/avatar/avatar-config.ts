/**
 * Avatar component configuration for AsheeUI.
 *
 * This file registers the values the Avatar defaults to on the web, so the
 * component-level fallback tier of the theme cascade has a value to resolve. The
 * options themselves, and the types that name them, live in `@asheeui/core`: they are
 * the framework's avatar contract rather than a web renderer's, and the native renderer
 * reads the same ones from the same place. What stays here is the web default values
 * and the registration that puts them in the web registry.
 */

import { type AvatarConfig, registerComponentDefaults } from "@asheeui/core";

export type { AvatarConfig } from "@asheeui/core";

/**
 * Default config values registered for the Avatar component.
 *
 * `color` is intentionally absent so it inherits from the global `defaultColor`.
 */
export const defaultAvatarConfig: AvatarConfig = {
  size: "md",
  radius: "full",
};

registerComponentDefaults("avatar", defaultAvatarConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_AVATAR_CONFIG: Required<AvatarConfig> = {
  size: "md",
  radius: "full",
  color: "primary",
} as const;
