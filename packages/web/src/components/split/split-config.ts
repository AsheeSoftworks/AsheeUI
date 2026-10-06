/**
 * Split component configuration for AsheeUI.
 *
 * This file registers the values the Split defaults to on the web, so the
 * component-level fallback tier of the theme cascade has a value to resolve. The
 * options themselves, and the types that name them, live in `@asheeui/core`: they are
 * the framework's split contract rather than a web renderer's, and the native renderer
 * reads the same ones from the same place. What stays here is the web default values
 * and the registration that puts them in the web registry.
 */

import { registerComponentDefaults, type SplitConfig } from "@asheeui/core";

export type {
  SplitAlign,
  SplitConfig,
  SplitRatio,
  SplitStackAt,
} from "@asheeui/core";

/**
 * Default config values registered for the Split component.
 * The breakpoint and the ratio are pinned; alignment, divider and stickiness
 * stay unset so a consumer's own value is the only one the cascade sees.
 */
export const defaultSplitConfig: SplitConfig = {
  stackAt: "lg",
  ratio: "equal",
  gap: "lg",
  align: "stretch",
};

registerComponentDefaults("split", defaultSplitConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_SPLIT_CONFIG: Required<SplitConfig> = {
  stackAt: "lg",
  ratio: "equal",
  gap: "lg",
  align: "stretch",
  divider: false,
  stickyEnd: false,
};
