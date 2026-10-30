/**
 * Stack component configuration for AsheeUI.
 *
 * The *shape* of `components.stack` is `@asheeui/core`'s — the direction, gap, alignment,
 * justification and wrapping are declared once, for both platforms, in
 * `packages/core/src/components/layouts/stack/stack-config.ts`. This module keeps what is the web's:
 * the defaults it registers, the hard fallbacks it states, and the `HStack`/`VStack` presets built on
 * them.
 */

import type { StackConfig } from "@asheeui/core";
import { registerComponentDefaults } from "@asheeui/core";

export type {
  StackAlign,
  StackConfig,
  StackDirection,
  StackJustify,
} from "@asheeui/core";

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
