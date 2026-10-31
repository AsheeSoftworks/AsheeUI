/**
 * Split component configuration for the native package.
 *
 * The options are the ones the framework's split contract names, so `components.split`
 * is configured the same way on both platforms, and the types are re-exported from
 * `@asheeui/core` rather than restated here. What stays with the renderer is the value
 * each option defaults to on the platform, and the registration that puts it in the
 * native registry.
 */

import type { SplitConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../../config/registry";

export type {
  SplitAlign,
  SplitConfig,
  SplitRatio,
  SplitStackAt,
} from "@asheeui/core";

/**
 * Configuration options for the native Split.
 *
 * @deprecated Use {@link SplitConfig} from `@asheeui/core` — the name both renderers
 * publish.
 */
export type NativeSplitConfig = SplitConfig;

/**
 * The defaults the Split registers with the native registry.
 *
 * They are the web's own values: a split stacks until a laptop's width and then divides
 * its width equally. A tablet is often held in one hand, so the platform's own docs
 * layouts state `md` at the call site rather than the framework deciding for them.
 *
 * @deprecated Use {@link defaultSplitConfig} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const defaultNativeSplitConfig: NativeSplitConfig = {
  stackAt: "lg",
  ratio: "equal",
  gap: "lg",
  align: "stretch",
};

declare module "../../../config/registry" {
  interface NativeComponentConfigRegistry {
    split: NativeSplitConfig;
  }
}

registerNativeComponentDefaults("split", defaultNativeSplitConfig);

/**
 * The values the split falls back to when no tier provides one.
 *
 * @deprecated Use {@link FALLBACK_SPLIT_CONFIG} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const FALLBACK_NATIVE_SPLIT_CONFIG = {
  stackAt: "lg",
  ratio: "equal",
  gap: "lg",
  align: "stretch",
  divider: false,
  stickyEnd: false,
} satisfies NativeSplitConfig;
