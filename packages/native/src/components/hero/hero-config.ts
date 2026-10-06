/**
 * Hero component configuration for the native package.
 *
 * The options are the ones the framework's hero contract names, so
 * `components.hero` is configured the same way on both platforms, and the type is
 * re-exported from `@asheeui/core` rather than restated here. What stays with the
 * renderer is the value each option defaults to on the platform, and the
 * registration that puts it in the native registry.
 */

import type { HeroConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

export type { HeroAlign, HeroConfig, HeroMediaPosition } from "@asheeui/core";

/**
 * Configuration options for the native Hero.
 */
export type NativeHeroConfig = HeroConfig;

/**
 * The defaults the Hero registers with the native registry.
 *
 * They are the web's own values, because a leading statement is the same statement
 * on either platform: the differences a hero has here are in what it draws, not in
 * what it defaults to.
 */
export const defaultNativeHeroConfig: NativeHeroConfig = {
  align: "start",
  spacing: "xl",
  background: "none",
  mediaPosition: "end",
  containerSize: "lg",
  contained: true,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    hero: NativeHeroConfig;
  }
}

registerNativeComponentDefaults("hero", defaultNativeHeroConfig);

/**
 * The values the hero falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_HERO_CONFIG: Required<NativeHeroConfig> = {
  align: "start",
  spacing: "xl",
  background: "none",
  mediaPosition: "end",
  containerSize: "lg",
  contained: true,
};
