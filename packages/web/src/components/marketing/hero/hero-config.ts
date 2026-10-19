/**
 * Hero component configuration for AsheeUI.
 *
 * This file registers the values the Hero defaults to on the web, so the component-level
 * fallback tier of the theme cascade has a value to resolve. The options themselves, and the
 * types that name them, live in `@asheeui/core`: they are the framework's hero contract
 * rather than a web renderer's, and the native renderer reads the same ones from the same
 * place. What stays here is the web default values and the registration that puts them in
 * the web registry.
 */

import { type HeroConfig, registerComponentDefaults } from "@asheeui/core";

export type { HeroAlign, HeroConfig, HeroMediaPosition } from "@asheeui/core";

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
