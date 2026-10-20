/**
 * The Testimonials' configuration face, shared by both platforms.
 *
 * A testimonials band is a heading and a grid of attributed quotes. Both platforms ask it
 * the same questions: the band options every band shares (stated once in
 * `shared/section-block`), the column count at each of the framework's breakpoints, and the
 * space between the quotes. The quotes themselves are described here too, because the two
 * renderers read one description of a quote rather than two.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `testimonials` here is what makes `components.testimonials` a
 * known configuration section, on every platform, without each renderer restating it.
 */

import type { ElementType, ReactNode } from "react";
import type { GridColumns } from "../../../shared/grid";
import type { SectionBlockOptions } from "../../../shared/section-block";
import type { Space } from "../../../shared/spacing";

/**
 * One attributed quote.
 *
 * A quote is data rather than an element, so a band can be described by a configuration
 * file or a visual builder as well as by hand, which is the same rule the framework's
 * features and configured actions follow.
 */
export interface TestimonialItem {
  /** Stable identifier for the quote. Defaults to its position in the list. */
  id?: string | number | undefined;

  /** What the person said. */
  quote: ReactNode;

  /** Name of the person. */
  name: string;

  /** Role or organisation of the person. */
  role?: string | undefined;

  /** Picture of the person, passed to the framework's `Avatar`. */
  avatarSrc?: string | undefined;

  /** Component that replaces the avatar picture, such as a framework image. */
  avatarComponent?: ElementType | undefined;

  /** Additional props for that component. */
  avatarComponentProps?: Record<string, unknown> | undefined;
}

/**
 * Theme configuration options for the Testimonials component.
 *
 * Set under `components.testimonials` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface TestimonialsConfig extends SectionBlockOptions {
  /** Columns from the smallest window upwards. */
  columns?: GridColumns | undefined;

  /** Columns from the `md` breakpoint upwards. */
  columnsMd?: GridColumns | undefined;

  /** Columns from the `lg` breakpoint upwards. */
  columnsLg?: GridColumns | undefined;

  /** Space between the quotes. */
  gap?: Space | undefined;
}

declare module "../../../registry" {
  interface ComponentTypeConfigRegistry {
    testimonials: TestimonialsConfig;
  }
}
