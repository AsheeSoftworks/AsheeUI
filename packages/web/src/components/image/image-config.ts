/**
 * Image component configuration for AsheeUI.
 *
 * This file registers the values the Image defaults to on the web, so the
 * component-level fallback tier of the theme cascade has a value to resolve. The
 * options themselves, and the types that name them, live in `@asheeui/core`: they are
 * the framework's image contract rather than a web renderer's, and the native renderer
 * reads the same ones from the same place. What stays here is the web default values
 * and the registration that puts them in the web registry.
 */

import { type ImageConfig, registerComponentDefaults } from "@asheeui/core";

export type {
  ImageConfig,
  ImageFit,
  ImageLoading,
  ImageRatioKey,
} from "@asheeui/core";

/**
 * Default config values registered for the Image component.
 */
export const defaultImageConfig: ImageConfig = {
  fit: "cover",
  ratio: "auto",
  radius: "md",
  loading: "lazy",
  showSkeleton: true,
};

registerComponentDefaults("image", defaultImageConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 */
export const FALLBACK_IMAGE_CONFIG = {
  fit: "cover",
  ratio: "auto",
  radius: "md",
  loading: "lazy",
  showSkeleton: true,
} as const;
