/**
 * The Stack's configuration section, shared by both platforms.
 *
 * Direction, gap, alignment, justification and wrapping are the framework's questions about a row or
 * a column of content, so `components.stack` means one thing on both platforms and each renderer
 * keeps only the values it lands on.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type augmentation:
 * declaring `stack` here is what makes `components.stack` a known configuration section on every
 * platform, without each renderer restating it.
 */

import type { Space } from "../../../shared/spacing";

/**
 * Flex direction of a stack.
 * `row` lays children out horizontally, `column` vertically.
 */
export type StackDirection = "row" | "column";

/**
 * Cross-axis alignment of a stack's children.
 * `stretch` makes them fill the cross axis, `baseline` aligns their first
 * line of text.
 */
export type StackAlign = "start" | "center" | "end" | "stretch" | "baseline";

/**
 * Main-axis distribution of a stack's children.
 */
export type StackJustify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

/**
 * Theme configuration options for the Stack component.
 *
 * Set under `components.stack` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface StackConfig {
  /**
   * Flex direction.
   *
   * Not registered, so the hard fallback answers it for a plain `Stack`, the
   * `HStack`/`VStack` presets contribute their own direction below this tier, and
   * a value stated here overrides both.
   *
   * @default "column"
   */
  direction?: StackDirection | undefined;

  /**
   * Space between children.
   *
   * @default "md"
   */
  gap?: Space | undefined;

  /**
   * Cross-axis alignment of the children.
   *
   * Not registered, for the same reason as `direction`: the presets state their
   * own alignment below this tier and a value here overrides them.
   *
   * @default "stretch"
   */
  align?: StackAlign | undefined;

  /**
   * Main-axis distribution of the children.
   *
   * @default "start"
   */
  justify?: StackJustify | undefined;

  /**
   * Whether children wrap onto another line when they run out of room.
   *
   * @default false
   */
  wrap?: boolean | undefined;
}

declare module "../../../registry" {
  interface ComponentTypeConfigRegistry {
    stack: StackConfig;
  }
}
