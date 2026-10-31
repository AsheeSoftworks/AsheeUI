/**
 * Section component configuration for AsheeUI.
 *
 * The *shape* of `components.section` is `@asheeui/core`'s — the vertical rhythm, the background
 * treatment, the optional container and the divider are declared once, for both platforms, in
 * `packages/core/src/components/layouts/section/section-config.ts`. This module keeps what is the
 * web's: the defaults it registers and the hard fallbacks it states.
 */

import type { SectionConfig } from "@asheeui/core";
import { registerComponentDefaults } from "@asheeui/core";

/**
 * The shared background vocabulary, re-exported so code that already reaches for it here keeps
 * working. The type itself is declared in `@asheeui/core`, so a `Section`, a hero and a call to
 * action name one type on both platforms.
 */
export type { SectionBackground, SectionConfig } from "@asheeui/core";

/**
 * Default config values registered for the Section component.
 */
export const defaultSectionConfig: SectionConfig = {
  spacing: "lg",
  background: "none",
  contained: false,
  containerSize: "lg",
  divider: false,
};

registerComponentDefaults("section", defaultSectionConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_SECTION_CONFIG = {
  spacing: "lg",
  background: "none",
  contained: false,
  containerSize: "lg",
  divider: false,
} satisfies SectionConfig;
