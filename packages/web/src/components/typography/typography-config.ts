/**
 * Typography component configuration for AsheeUI.
 *
 * The *shape* of `components.typography` is `@asheeui/core`'s — the role, the tone, the alignment,
 * truncation and the per-role retuning are declared once, for both platforms, in
 * `packages/core/src/components/typography/typography-config.ts`. This module keeps what is the
 * web's: the defaults it registers and the hard fallbacks it states.
 *
 * Configuration stays intentionally empty by default: the semantic roles in
 * `shared/typography.ts` already provide sensible behaviour, and AsheeUI
 * configuration only carries component-specific values (`REQ-062`).
 */

import type { TypographyConfig } from "@asheeui/core";
import { registerComponentDefaults } from "@asheeui/core";

export type { TypographyConfig } from "@asheeui/core";

/**
 * Default configuration registered for the Typography component.
 * Intentionally empty: roles and tones have framework fallbacks.
 */
export const defaultTypographyConfig: TypographyConfig = {};

registerComponentDefaults("typography", defaultTypographyConfig);

/**
 * Hard fallback values used when no cascade tier provides a value.
 */
export const FALLBACK_TYPOGRAPHY_CONFIG = {
  role: "body-md",
  tone: "default",
  truncate: false,
} satisfies Pick<TypographyConfig, "role" | "tone" | "truncate">;
