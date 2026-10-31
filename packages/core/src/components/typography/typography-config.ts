/**
 * The Typography component's configuration section, shared by both platforms.
 *
 * `components.typography` names the options a consumer states about text — the default role, the
 * tone, the alignment, truncation, and the per-role retuning — and it means the same thing on both
 * platforms, so it is declared here rather than in the renderer that happens to render it.
 *
 * The *interface* is all this module holds. What a role resolves to was deliberately kept in
 * `shared/typography.ts` by C3 — the six value arrays, the unions derived from them and
 * `TYPOGRAPHY_ROLE_TOKEN` — because B15 makes the platform read that table too; the class tables are
 * each renderer's, and this module states no class string at all.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type augmentation:
 * declaring `typography` here is what makes `components.typography` a known configuration section on
 * every platform, without each renderer restating it.
 */

import type {
  TypographyAlign,
  TypographyRole,
  TypographyRoleTokens,
  TypographyTone,
} from "../../shared/typography";

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
  role?: TypographyRole | undefined;

  /**
   * Default colour treatment.
   * @default "default"
   */
  tone?: TypographyTone | undefined;

  /**
   * Default text alignment. Unset means the alignment is inherited.
   */
  align?: TypographyAlign | undefined;

  /**
   * Whether text is truncated to a single line by default.
   * @default false
   */
  truncate?: boolean | undefined;

  /**
   * Per-application role overrides.
   *
   * Each entry retunes the size/style tokens a role resolves to, so a role can
   * keep its semantic meaning while the underlying typography changes. Values
   * still come from the static class maps, so no class is built dynamically.
   */
  roles?:
    | Partial<Record<TypographyRole, Partial<TypographyRoleTokens>>>
    | undefined;

  /**
   * Extra classes applied to every instance, before the instance `className`.
   *
   * This is the one web-shaped option in the section: a device composes styles from its own
   * dictionaries, so a native text accepts the key and states nothing with it.
   */
  className?: string | undefined;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    typography: TypographyConfig;
  }
}
