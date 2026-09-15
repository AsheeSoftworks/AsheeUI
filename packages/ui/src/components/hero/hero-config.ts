/**
 * Hero component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the Hero pattern:
 * alignment, vertical rhythm, background treatment, media position and content
 * width. It registers the default configuration with the component registry and
 * provides fallback values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Space } from "../../shared";
import type { ContainerSize } from "../container/container-config";
import type { SectionBackground } from "../section/section-config";

/**
 * Horizontal alignment of a hero's text column.
 */
export type HeroAlign = "start" | "center";

/**
 * Side the media occupies on a wide screen.
 */
export type HeroMediaPosition = "end" | "start";

/**
 * Theme configuration options for the Hero component.
 *
 * Set under `components.hero` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface HeroConfig {
  /**
   * Alignment of the text column.
   *
   * @default "start"
   */
  align?: HeroAlign;

  /**
   * Vertical padding of the hero band.
   *
   * @default "xl"
   */
  spacing?: Space;

  /**
   * Background treatment of the hero band.
   *
   * @default "none"
   */
  background?: SectionBackground;

  /**
   * Side the media occupies from the `lg` breakpoint upwards.
   *
   * @default "end"
   */
  mediaPosition?: HeroMediaPosition;

  /**
   * Maximum content width of the hero.
   *
   * @default "lg"
   */
  containerSize?: ContainerSize;

  /**
   * Whether the hero wraps its content in a {@link Container}.
   * The hero is contained automatically, so the framework's width and gutter
   * apply; a consumer turns this off to nest the hero in its own layout.
   *
   * @default true
   */
  contained?: boolean;
}

/**
 * Default config values registered for the Hero component.
 */
export const defaultHeroConfig: HeroConfig = {
  align: "start",
  spacing: "xl",
  background: "none",
  mediaPosition: "end",
  containerSize: "lg",
  contained: true,
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    hero: HeroConfig;
  }
}

registerComponentDefaults("hero", defaultHeroConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_HERO_CONFIG: Required<HeroConfig> = {
  align: "start",
  spacing: "xl",
  background: "none",
  mediaPosition: "end",
  containerSize: "lg",
  contained: true,
};
