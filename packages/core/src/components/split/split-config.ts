/**
 * The Split's configuration face, shared by both platforms.
 *
 * A split is two panes that stack on a narrow screen and sit side by side on a wide
 * one. Which options that takes — the breakpoint, the division of the width, the space
 * between the panes, their cross-axis alignment and whether a rule separates them — is
 * the same on both platforms, so the option names live here and both renderers read the
 * same keys. What a renderer keeps for itself is the value each option defaults to and
 * the way it expresses the breakpoint: the web has media queries and the platform has a
 * window width, so the rule is shared and the mechanism is not.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `split` here is what makes `components.split` a known
 * configuration section, on every platform, without each renderer restating it.
 */

import type { Space } from "../../shared/spacing";

/**
 * The breakpoints at which two panes stop stacking.
 * `sm` is a wide phone in landscape, `md` a tablet, `lg` a laptop and `xl` a large
 * desktop, which are the framework's shared breakpoints.
 */
export type SplitStackAt = "sm" | "md" | "lg" | "xl";

/**
 * How the two panes divide the width once they sit side by side.
 *
 * - `equal`: the panes share the width, for a comparison or a media pair.
 * - `start`: the first pane takes two thirds, for a content column beside a narrower
 *   aside.
 * - `end`: the second pane takes two thirds, for a narrow navigation column beside a
 *   wide content column.
 */
export type SplitRatio = "equal" | "start" | "end";

/**
 * Cross-axis alignment of the two panes on the wide layout.
 */
export type SplitAlign = "start" | "center" | "stretch";

/**
 * Theme configuration options for the Split component.
 *
 * Set under `components.split` in the AsheeUI config. Values feed the component-level
 * fallback tier of the theme cascade.
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
   * Whether the second pane sticks to the top of the viewport while the first pane
   * scrolls. It suits a table of contents or a summary column.
   *
   * @default false
   */
  stickyEnd?: boolean;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    split: SplitConfig;
  }
}
