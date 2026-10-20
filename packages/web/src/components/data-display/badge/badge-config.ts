/**
 * Badge component configuration for the web package.
 *
 * This file holds the web renderer's own side of the Badge's configuration: the values
 * it defaults to, and the registration that puts them in the component registry when the
 * component is imported. The option names and the values they accept are shared with the
 * native renderer, so the type itself lives in `@asheeui/core` and is re-exported here,
 * which keeps the package's public surface unchanged.
 */

import {
  type BadgeConfig,
  type BadgeVariant,
  registerComponentDefaults,
} from "@asheeui/core";

export type { BadgeConfig, BadgeVariant };

/**
 * Default config values registered for the Badge component.
 *
 * `variant` and `color` are intentionally absent so they inherit from the
 * global `defaultVariant` and `defaultColor`. `radius` is registered, so it is
 * pinned: a badge is a pill, and the application's `defaultRadius` does not reach
 * it. State `components.badge.radius` or the instance prop instead.
 */
export const defaultBadgeConfig: BadgeConfig = {
  size: "md",
  radius: "full",
};

registerComponentDefaults("badge", defaultBadgeConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_BADGE_CONFIG = {
  variant: "faded",
  color: "primary",
  size: "md",
  radius: "full",
} as const satisfies BadgeConfig;
