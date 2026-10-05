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
import type { Radius, Size } from "../shared/radius";

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
  id?: string;

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
  variant?: CarouselVariant;

  /**
   * Height of the carousel.
   *
   * @default "md"
   */
  size?: Size;

  /**
   * Corner rounding.
   *
   * @default "lg"
   */
  radius?: Radius;

  /**
   * Whether the slides advance by themselves.
   *
   * @default false
   */
  autoPlay?: boolean;

  /**
   * How long a slide stays before the next one, in milliseconds.
   *
   * @default 5000
   */
  autoPlayInterval?: number;

  /**
   * Whether the carousel returns to the first slide after the last.
   *
   * @default true
   */
  loop?: boolean;

  /**
   * Whether the previous and next controls are shown.
   *
   * @default true
   */
  showControls?: boolean;

  /**
   * Whether the dot indicators are shown.
   *
   * @default true
   */
  showIndicators?: boolean;

  /**
   * Whether the advance pauses while the reader is interacting with the carousel.
   *
   * @default true
   */
  pauseOnHover?: boolean;

  /**
   * Whether moving between slides is animated.
   *
   * @default false
   */
  disableAnimation?: boolean;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    carousel: CarouselConfig;
  }
}
