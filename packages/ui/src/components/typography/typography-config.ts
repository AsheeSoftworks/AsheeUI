/**
 * Typography component configuration for AsheeUI.
 *
 * This file defines the configuration types and defaults for the `Typography`
 * component and registers the component with the configuration registry so its
 * options participate in the normal cascade.
 *
 * Configuration stays intentionally empty by default: the semantic roles in
 * `shared/typography.ts` already provide sensible behaviour, and AsheeUI
 * configuration only carries component-specific values (`REQ-062`).
 */

import { registerComponentDefaults } from "../../libs/registry";
import type {
  TypographyAlign,
  TypographyRole,
  TypographyRoleTokens,
  TypographyTone,
} from "../../shared";

/**
 * Configuration options for the Typography component.
 *
 * Set under `components.typography` in the AsheeUI configuration.
 */
export interface TypographyConfig {
  /**
   * Default semantic role.
   * @default "body-md"
   */
  role?: TypographyRole;

  /**
   * Default colour treatment.
   * @default "default"
   */
  tone?: TypographyTone;

  /**
   * Default text alignment. Unset means the alignment is inherited.
   */
  align?: TypographyAlign;

  /**
   * Whether text is truncated to a single line by default.
   * @default false
   */
  truncate?: boolean;

  /**
   * Per-application role overrides.
   *
   * Each entry retunes the size/style tokens a role resolves to, so a role can
   * keep its semantic meaning while the underlying typography changes. Values
   * still come from the static class maps, so no class is built dynamically.
   */
  roles?: Partial<Record<TypographyRole, Partial<TypographyRoleTokens>>>;

  /**
   * Extra classes applied to every instance, before the instance `className`.
   */
  className?: string;
}

/**
 * Default configuration registered for the Typography component.
 * Intentionally empty: roles and tones have framework fallbacks.
 */
export const defaultTypographyConfig: TypographyConfig = {};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    typography: TypographyConfig;
  }
}

registerComponentDefaults("typography", defaultTypographyConfig);

/**
 * Hard fallback values used when no cascade tier provides a value.
 */
export const FALLBACK_TYPOGRAPHY_CONFIG: Required<
  Pick<TypographyConfig, "role" | "tone" | "truncate">
> = {
  role: "body-md",
  tone: "default",
  truncate: false,
};
