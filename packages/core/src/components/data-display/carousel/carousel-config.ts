/**
 * The Carousel's configuration face, shared by both platforms.
 *
 * A carousel is a strip of slides the reader moves through, and both platforms ask it the
 * same questions: how it is drawn, how tall it is, how round its corners are, whether it
 * advances by itself and how often, whether it returns to the beginning at the end,
 * whether it shows controls and indicators, and whether its movement can be switched off.
 * Those are named here, once, so `components.carousel` means the same thing in a web
 * application and in a native one.
 *
 * Two of the options are read differently by each renderer, and the difference is the
 * platform's rather than a preference. `loop` is about what happens at the end: the web
 * wraps a scroll position, and the platform's scroll view does not, so there it wraps the
 * autoplay and leaves a reader who swiped to the end where they are. `pauseOnHover` is about
 * what pauses the advance: the web pauses while a pointer rests on a slide, and the platform
 * has no pointer, so it pauses while the reader is dragging.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `carousel` here is what makes `components.carousel` a known
 * configuration section without either renderer restating it.
 */

import type { ReactNode } from "react";
import type { Radius, Size } from "../../../shared/radius";
import type { Variant } from "../../../shared/variant";

/**
 * Visual style of the carousel.
 *
 * - `bordered`: a bordered card with a background.
 * - `ghost`: no border and no background of its own.
 */
export type CarouselVariant = "bordered" | "ghost";

/**
 * A single slide.
 */
export interface CarouselItem {
  /** Unique identifier for the slide. */
  id?: string | undefined;

  /** What the slide shows. */
  content: ReactNode;
}

/**
 * Configuration options for the Carousel.
 *
 * Set under `components.carousel` in the AsheeUI config. Values feed the component-level
 * fallback tier of the theme cascade.
 */
export interface CarouselConfig {
  /**
   * Visual style variant.
   *
   * @default "bordered"
   */
  variant?: CarouselVariant | undefined;

  /**
   * Height of the carousel.
   *
   * @default "md"
   */
  size?: Size | undefined;

  /**
   * Corner rounding.
   *
   * @default "lg"
   */
  radius?: Radius | undefined;

  /**
   * Whether the slides advance by themselves.
   *
   * @default false
   */
  autoPlay?: boolean | undefined;

  /**
   * How long a slide stays before the next one, in milliseconds.
   *
   * @default 5000
   */
  autoPlayInterval?: number | undefined;

  /**
   * Whether the carousel returns to the first slide after the last.
   *
   * @default true
   */
  loop?: boolean | undefined;

  /**
   * Whether the previous and next controls are shown.
   *
   * @default true
   */
  showControls?: boolean | undefined;

  /**
   * Whether the dot indicators are shown.
   *
   * @default true
   */
  showIndicators?: boolean | undefined;

  /**
   * Whether the advance pauses while the reader is interacting with the carousel.
   *
   * @default true
   */
  pauseOnHover?: boolean | undefined;

  /**
   * Whether moving between slides is animated.
   *
   * @default false
   */
  disableAnimation?: boolean | undefined;
}

/**
 * The frame each treatment a config tier can name renders as.
 *
 * A carousel is a frame rather than a control, so it cannot draw every treatment the
 * shared vocabulary names. Left untranslated, a treatment it cannot draw misses the
 * class map and the carousel silently renders as `bordered` — the same problem Badge,
 * Chip and Card solve with `resolveBadgeVariant`, `resolveChipVariant` and
 * `resolveCardVariant`.
 *
 * - `solid`: the filled, highest-emphasis treatment. The carousel's filled surface is
 *   `bordered`, which is the one that carries a background, so a filled treatment
 *   lands there rather than on the transparent `ghost` frame.
 * - `bordered`, `ghost`: already carousel frames, so they keep their meaning.
 * - `faded`: the framework's resting treatment and the shipped `defaultVariant`. The
 *   carousel's documented default is `bordered`, so the framework default keeps
 *   rendering a bordered frame rather than restyling every unconfigured carousel.
 * - `underlined`: a frame has no baseline to rule, so it lands on the nearest frame it
 *   can draw, `bordered`.
 *
 * The carousel's own names map to themselves, so a frame named on the instance or under
 * `components.carousel.variant` reaches the class map unchanged.
 */
const CAROUSEL_VARIANT_FOR_TREATMENT: Record<
  Variant | CarouselVariant,
  CarouselVariant
> = {
  solid: "bordered",
  bordered: "bordered",
  ghost: "ghost",
  faded: "bordered",
  underlined: "bordered",
};

/**
 * Resolve a treatment to the frame the carousel can draw.
 *
 * The cascade's last tiers are the framework's rather than the carousel's, so they can
 * name a treatment the carousel has no class for. This is where the two vocabularies
 * meet: the treatment lands on the nearest carousel frame instead of the class look-up
 * answering `undefined` and the carousel quietly rendering as `bordered`. Both the
 * treatment a tier named and the carousel's own frame names are accepted, so the
 * resolver can wrap the cascade's result whichever tier answered.
 *
 * @param treatment - The treatment the cascade produced.
 * @returns The frame to render.
 *
 * @example
 * ```ts
 * resolveCarouselVariant("solid"); // "bordered"
 * resolveCarouselVariant("faded"); // "bordered"
 * resolveCarouselVariant("ghost"); // "ghost"
 * ```
 */
export function resolveCarouselVariant(
  treatment: Variant | CarouselVariant,
): CarouselVariant {
  // A plain JS/JSON consumer can name any string at runtime, so a treatment the
  // carousel does not know falls back to its default frame rather than to nothing.
  return CAROUSEL_VARIANT_FOR_TREATMENT[treatment] ?? "bordered";
}

declare module "../../../registry" {
  interface ComponentTypeConfigRegistry {
    carousel: CarouselConfig;
  }
}
