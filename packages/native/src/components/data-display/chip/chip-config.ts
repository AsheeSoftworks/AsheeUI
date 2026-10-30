/**
 * Chip component configuration for the native package.
 *
 * The options are the ones the framework's chip contract names, so `components.chip` is
 * configured the same way on both platforms, and the type is re-exported from
 * `@asheeui/core` rather than restated here. What stays with the renderer is the value
 * each option defaults to on the platform, and the registration that puts it in the
 * native registry.
 */

import type { ChipConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../../config/registry";

export type { ChipConfig } from "@asheeui/core";

/**
 * Configuration options for the native Chip.
 *
 * @deprecated Use {@link ChipConfig} from `@asheeui/core` — the name both renderers
 * publish.
 */
export type NativeChipConfig = ChipConfig;

/**
 * The defaults the Chip registers with the native registry.
 *
 * They are the web's own values: a chip is a medium, fully-rounded token on both
 * platforms. `variant` and `color` are absent on purpose, so they inherit from the
 * platform's default treatment and colour instead of pinning themselves here.
 *
 * @deprecated Use {@link defaultChipConfig} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const defaultNativeChipConfig: NativeChipConfig = {
  size: "md",
  radius: "full",
};

declare module "../../../config/registry" {
  interface NativeComponentConfigRegistry {
    chip: NativeChipConfig;
  }
}

registerNativeComponentDefaults("chip", defaultNativeChipConfig);

/**
 * The values the chip falls back to when no tier provides one.
 *
 * @deprecated Use {@link FALLBACK_CHIP_CONFIG} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const FALLBACK_NATIVE_CHIP_CONFIG = {
  size: "md",
  variant: "bordered",
  color: "primary",
  radius: "full",
} satisfies NativeChipConfig;
