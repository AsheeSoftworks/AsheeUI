/**
 * MarketingLayout component configuration for the native package.
 *
 * The options are the ones the framework's marketing-layout contract names, so
 * `components.marketinglayout` is configured the same way on both platforms, and the types
 * are re-exported from `@asheeui/core` rather than restated here. What stays with the
 * renderer is the value each option defaults to on the platform, and the registration that
 * puts it in the native registry.
 */

import type { MarketingLayoutConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../../config/registry";

export type {
  MarketingLayoutBackground,
  MarketingLayoutConfig,
} from "@asheeui/core";

/**
 * Configuration options for the native marketing composition.
 *
 * @deprecated Use {@link MarketingLayoutConfig} from `@asheeui/core` — the name both renderers
 * publish.
 */
export type NativeMarketingLayoutConfig = MarketingLayoutConfig;

/**
 * The defaults the marketing composition registers with the native registry.
 *
 * They are the web's own values, including the skip link's, which the platform has no focus
 * order to apply: the option still resolves, so a configuration written for a browser
 * describes a device as well rather than quietly becoming something else.
 *
 * @deprecated Use {@link defaultMarketingLayoutConfig} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const defaultNativeMarketingLayoutConfig: NativeMarketingLayoutConfig = {
  skipLink: true,
  skipLinkLabel: "Skip to content",
  background: "default",
};

declare module "../../../config/registry" {
  interface NativeComponentConfigRegistry {
    marketinglayout: NativeMarketingLayoutConfig;
  }
}

registerNativeComponentDefaults(
  "marketinglayout",
  defaultNativeMarketingLayoutConfig,
);

/**
 * The values the marketing composition falls back to when no tier provides one.
 *
 * @deprecated Use {@link FALLBACK_MARKETING_LAYOUT_CONFIG} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const FALLBACK_NATIVE_MARKETING_LAYOUT_CONFIG = {
  skipLink: true,
  skipLinkLabel: "Skip to content",
  background: "default",
} satisfies NativeMarketingLayoutConfig;
