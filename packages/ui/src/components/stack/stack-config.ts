/**
 * Stack component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the Stack layout
 * primitive and its `HStack` and `VStack` presets: direction, gap, alignment,
 * justification and wrapping. It registers the default configuration with the
 * component registry and provides fallback values for the cascade.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Space } from "../../shared";

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
   * @default "column"
   */
  direction?: StackDirection;

  /**
   * Space between children.
   *
   * @default "md"
   */
  gap?: Space;

  /**
   * Cross-axis alignment of the children.
   *
   * @default "stretch"
   */
  align?: StackAlign;

  /**
   * Main-axis distribution of the children.
   *
   * @default "start"
   */
  justify?: StackJustify;

  /**
   * Whether children wrap onto another line when they run out of room.
   *
   * @default false
   */
  wrap?: boolean;
}

/**
 * Default config values registered for the Stack component.
 */
export const defaultStackConfig: StackConfig = {
  direction: "column",
  gap: "md",
  align: "stretch",
  justify: "start",
  wrap: false,
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    stack: StackConfig;
  }
}

registerComponentDefaults("stack", defaultStackConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_STACK_CONFIG: Required<StackConfig> = {
  direction: "column",
  gap: "md",
  align: "stretch",
  justify: "start",
  wrap: false,
};
