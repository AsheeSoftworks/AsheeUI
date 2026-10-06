/**
 * Testimonials component configuration for the native package.
 *
 * The options are the ones the framework's testimonials contract names, so
 * `components.testimonials` is configured the same way on both platforms, and the types are
 * re-exported from `@asheeui/core` rather than restated here. What stays with the renderer
 * is the value each option defaults to on the platform, and the registration that puts it
 * in the native registry.
 */

import type { TestimonialsConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

export type {
  TestimonialItem,
  TestimonialsConfig,
} from "@asheeui/core";

/**
 * Configuration options for the native Testimonials band.
 */
export type NativeTestimonialsConfig = TestimonialsConfig;

/**
 * The defaults the Testimonials band registers with the native registry.
 *
 * They are the web's own values: one quote on a phone, two from a tablet's width and three
 * from a laptop's, centred under a centred heading. A band is the same band on a phone — it
 * simply gets fewer columns, which the grid resolves from the window the platform reports
 * rather than from a stylesheet.
 */
export const defaultNativeTestimonialsConfig: NativeTestimonialsConfig = {
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

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    testimonials: NativeTestimonialsConfig;
  }
}

registerNativeComponentDefaults(
  "testimonials",
  defaultNativeTestimonialsConfig,
);

/**
 * The values the Testimonials band falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_TESTIMONIALS_CONFIG: Required<NativeTestimonialsConfig> =
  {
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
