/**
 * The Avatar's configuration face, shared by both platforms.
 *
 * The option names, the values they accept and their meaning are the part of the Avatar
 * both renderers agree on, so a consumer configures `components.avatar` once and both
 * platforms read the same keys. What a renderer keeps for itself is the value each
 * option defaults to, because that is a platform property.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `avatar` here is what makes `components.avatar` a known
 * configuration section, on every platform, without each renderer restating it.
 *
 * The initials an avatar falls back to are shared behaviour rather than a platform
 * detail, so the rule that derives them lives beside this contract, in
 * `./avatar-initials`, and both renderers read it from there. An initial derived one way
 * on the web and another way on the platform would be the same entity presented as two.
 */

import type { Radius, Size } from "../../shared/radius";
import type { Color } from "../../shared/variant";

/**
 * Theme configuration options for the Avatar component.
 *
 * Set under `components.avatar` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface AvatarConfig {
  /**
   * Diameter scale of the avatar.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * Corner rounding.
   * The default makes a circular avatar; a smaller radius makes it square.
   *
   * @default "full"
   */
  radius?: Radius;

  /**
   * Theme accent colour.
   * Colours the surface the initials fall back to. It does not tint the image.
   *
   * @default "primary"
   */
  color?: Color;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    avatar: AvatarConfig;
  }
}
