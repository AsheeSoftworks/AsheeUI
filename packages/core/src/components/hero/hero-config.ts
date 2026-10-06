/**
 * The Hero's configuration face, shared by both platforms.
 *
 * A hero is the leading statement of a page: an eyebrow, a headline, a supporting sentence,
 * up to two configured actions and an optional media slot. Both platforms ask it the same
 * questions about how it sits on the page — how wide its content may grow, how much vertical
 * room it claims, what it paints behind that content, whether it centres what it holds and
 * whether it draws its own column — and those are the band options, stated once in
 * `shared/section-block`. What a hero adds is the one question of its own: which side its
 * media takes when the window is wide enough to put media and text beside each other.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `hero` here is what makes `components.hero` a known configuration
 * section without either renderer restating it. The values each platform defaults to, and
 * the registration that puts them in a registry, belong to the renderer.
 */

import type { SectionBlockOptions } from "../../shared/section-block";

/**
 * Horizontal alignment of a hero's text column.
 */
export type HeroAlign = "start" | "center";

/**
 * Side the media occupies once the window is wide enough to place it beside the text.
 */
export type HeroMediaPosition = "end" | "start";

/**
 * Configuration options for the Hero.
 *
 * Set under `components.hero` in the AsheeUI config. Values feed the component-level
 * fallback tier of the theme cascade.
 */
export interface HeroConfig extends SectionBlockOptions {
  /** Side the media occupies from the `lg` breakpoint upwards. */
  mediaPosition?: HeroMediaPosition;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    hero: HeroConfig;
  }
}
