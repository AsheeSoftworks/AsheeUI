/**
 * Stack component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the Stack layout
 * primitive and its `HStack` and `VStack` presets: direction, gap, alignment,
 * justification and wrapping. It registers the default configuration with the
 * component registry and provides fallback values for the cascade.
 */

import type { Space } from "@asheeui/core";
import { registerComponentDefaults } from "@asheeui/core";

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

/**
 * Default config values registered for the Stack component.
 *
 * `direction` and `align` are deliberately not registered. `HStack` and `VStack`
 * contribute their own direction and alignment below the component tier, and a
 * registered value would outrank them and make the presets ignore
 * `components.stack.direction`/`.align` forever. Leaving the two options
 * unregistered means the hard fallback still states the plain `Stack`'s column
 * and stretch, a preset states its own pair, and configuration outranks both.
 */
export const defaultStackConfig: StackConfig = {
  gap: "md",
  justify: "start",
  wrap: false,
};

declare module "@asheeui/core" {
  interface ComponentTypeConfigRegistry {
    stack: StackConfig;
  }
}

registerComponentDefaults("stack", defaultStackConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_STACK_CONFIG = {
  direction: "column",
  gap: "md",
  align: "stretch",
  justify: "start",
  wrap: false,
} satisfies StackConfig;
