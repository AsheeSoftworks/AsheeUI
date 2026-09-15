/**
 * Split component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the Split layout
 * primitive: which breakpoint the two panes sit side by side, how the width is
 * divided between them, the space between them, their cross-axis alignment and
 * whether a divider separates them. It registers the default configuration with
 * the component registry and provides fallback values for the cascade resolution
 * system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Space } from "../../shared";

/**
 * The breakpoints at which two panes stop stacking.
 * `sm` is a wide phone in landscape, `md` a tablet, `lg` a laptop and `xl` a
 * large desktop, which are the framework's shared breakpoints.
 */
export type SplitStackAt = "sm" | "md" | "lg" | "xl";

/**
 * How the two panes divide the width once they sit side by side.
 *
 * - `equal`: the panes share the width, for a comparison or a media pair.
 * - `start`: the first pane takes two thirds, for a content column beside a
 *   narrower aside.
 * - `end`: the second pane takes two thirds, for a narrow navigation column
 *   beside a wide content column.
 */
export type SplitRatio = "equal" | "start" | "end";

/**
 * Cross-axis alignment of the two panes on the wide layout.
 */
export type SplitAlign = "start" | "center" | "stretch";

/**
 * Theme configuration options for the Split component.
 *
 * Set under `components.split` in the AsheeUI config. Values feed the
 * component-level tier of the theme cascade.
 */
export interface SplitConfig {
  /**
   * Breakpoint from which the panes sit side by side instead of stacking.
   *
   * @default "lg"
   */
  stackAt?: SplitStackAt;

  /**
   * How the panes divide the width.
   *
   * @default "equal"
   */
  ratio?: SplitRatio;

  /**
   * Space between the two panes.
   *
   * @default "lg"
   */
  gap?: Space;

  /**
   * Cross-axis alignment of the panes.
   *
   * @default "stretch"
   */
  align?: SplitAlign;

  /**
   * Whether a border is drawn between the panes on the wide layout.
   * On the narrow layout the panes stack, so there is nothing to separate.
   *
   * @default false
   */
  divider?: boolean;

  /**
   * Whether the second pane sticks to the top of the viewport while the first
   * pane scrolls. It suits a table of contents or a summary column.
   *
   * @default false
   */
  stickyEnd?: boolean;
}

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

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    split: SplitConfig;
  }
}

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
