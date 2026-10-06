/**
 * Footer component configuration for the native package.
 *
 * The options are the ones the framework's footer contract names, so
 * `components.footer` is configured the same way on both platforms, and the type is
 * re-exported from `@asheeui/core` rather than restated here. What stays with the
 * renderer is the value each option defaults to on the platform, and the registration
 * that puts it in the native registry.
 *
 * A footer takes fewer options than the other bands, and the shared module states why:
 * a footer is never centred and it paints its own surface, so it states its rhythm, its
 * container and its own surface rather than the whole band vocabulary.
 */

import type { FooterConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

export type {
  FooterConfig,
  FooterGroup,
  FooterLinkItem,
  FooterVariant,
} from "@asheeui/core";

/**
 * Configuration options for the native Footer.
 */
export type NativeFooterConfig = FooterConfig;

/**
 * The defaults the Footer registers with the native registry.
 *
 * They are the web's own values. The platform states a different transparency step for
 * a muted footer, because the web can let a page background show through and the
 * platform states the colour role its surface takes, but which treatment a footer
 * defaults to is not a platform question.
 */
export const defaultNativeFooterConfig: NativeFooterConfig = {
  variant: "bordered",
  spacing: "lg",
  contained: true,
  containerSize: "lg",
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    footer: NativeFooterConfig;
  }
}

registerNativeComponentDefaults("footer", defaultNativeFooterConfig);

/**
 * The values the footer falls back to when no tier provides one.
 */
export const FALLBACK_NATIVE_FOOTER_CONFIG: Required<NativeFooterConfig> = {
  variant: "bordered",
  spacing: "lg",
  contained: true,
  containerSize: "lg",
};
