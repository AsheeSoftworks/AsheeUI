/**
 * Testimonials component configuration for AsheeUI.
 *
 * This file registers the values the testimonials band defaults to on the web, so the
 * component-level fallback tier of the theme cascade has a value to resolve. The options
 * themselves, and the types that name them, live in `@asheeui/core`: they are the
 * framework's testimonials contract rather than a web renderer's, and the native renderer
 * reads the same ones from the same place. What stays here is the web default values and
 * the registration that puts them in the web registry.
 */

import {
  registerComponentDefaults,
  type TestimonialsConfig,
} from "@asheeui/core";

export type { TestimonialItem, TestimonialsConfig } from "@asheeui/core";

/**
 * Default config values registered for the Testimonials component.
 */
export const defaultTestimonialsConfig: TestimonialsConfig = {
  columns: 1,
  columnsMd: 2,
  columnsLg: 3,
  gap: "lg",
  spacing: "lg",
  background: "none",
  align: "center",
  containerSize: "lg",
  contained: true,
};

registerComponentDefaults("testimonials", defaultTestimonialsConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_TESTIMONIALS_CONFIG: Required<TestimonialsConfig> = {
  columns: 1,
  columnsMd: 2,
  columnsLg: 3,
  gap: "lg",
  spacing: "lg",
  background: "none",
  align: "center",
  containerSize: "lg",
  contained: true,
};
