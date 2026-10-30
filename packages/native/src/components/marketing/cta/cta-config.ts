/**
 * CTA component configuration for the native package.
 *
 * The options are the ones the framework's call-to-action contract names, so
 * `components.cta` is configured the same way on both platforms, and the type is
 * re-exported from `@asheeui/core` rather than restated here. What stays with the
 * renderer is the value each option defaults to on the platform, and the
 * registration that puts it in the native registry.
 */

import type { CtaConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../../config/registry";

export type { CtaConfig, CtaPanel } from "@asheeui/core";

/**
 * Configuration options for the native CTA.
 *
 * @deprecated Use {@link CtaConfig} from `@asheeui/core` — the name both renderers
 * publish.
 */
export type NativeCtaConfig = CtaConfig;

/**
 * The defaults the CTA registers with the native registry.
 *
 * They are the web's own values: a closing statement is centred on both platforms,
 * and the platform's differences here are in the density of its panel rather than in
 * which treatment it defaults to.
 *
 * @deprecated Use {@link defaultCtaConfig} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const defaultNativeCtaConfig: NativeCtaConfig = {
  align: "center",
  spacing: "lg",
  background: "none",
  panel: "bordered",
  containerSize: "lg",
  contained: true,
};

declare module "../../../config/registry" {
  interface NativeComponentConfigRegistry {
    cta: NativeCtaConfig;
  }
}

registerNativeComponentDefaults("cta", defaultNativeCtaConfig);

/**
 * The values the CTA falls back to when no tier provides one.
 *
 * @deprecated Use {@link FALLBACK_CTA_CONFIG} — the name both renderers publish. The value is
 * this one: a fallback states the platform's default, and the name is shared.
 */
export const FALLBACK_NATIVE_CTA_CONFIG = {
  align: "center",
  spacing: "lg",
  background: "none",
  panel: "bordered",
  containerSize: "lg",
  contained: true,
} satisfies NativeCtaConfig;
