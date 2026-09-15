/**
 * Typography style resolution for AsheeUI.
 *
 * This file composes the class string for a semantic role. Roles resolve to a
 * complete, static class string through the shared token maps, and only the
 * per-role override path composes classes, always from those static maps, so no
 * Tailwind utility name is ever built dynamically.
 */

import {
  TYPOGRAPHY_LEADING_CLASS,
  TYPOGRAPHY_ROLE_CLASS,
  TYPOGRAPHY_ROLE_TOKEN,
  TYPOGRAPHY_SIZE_CLASS,
  TYPOGRAPHY_TRACKING_CLASS,
  TYPOGRAPHY_WEIGHT_CLASS,
  type TypographyRole,
  type TypographyRoleTokens,
} from "../../shared";
import { cn } from "../../utils";

/**
 * Compose a role's class string from its size/style tokens.
 *
 * @param tokens - Complete size/style tokens.
 * @returns A space-separated class string of static utilities.
 */
export function composeTypographyRoleClass(
  tokens: TypographyRoleTokens,
): string {
  return cn(
    TYPOGRAPHY_SIZE_CLASS[tokens.size],
    TYPOGRAPHY_WEIGHT_CLASS[tokens.weight],
    TYPOGRAPHY_LEADING_CLASS[tokens.leading],
    TYPOGRAPHY_TRACKING_CLASS[tokens.tracking],
  );
}

/**
 * Resolve the class string for a semantic role.
 *
 * With no overrides the role's literal class string is returned directly. When
 * a role has been retuned, the tokens are resolved (overrides on top of the
 * role table) and composed from the static maps.
 *
 * @param role - Semantic role.
 * @param overrides - Partial token overrides for the role.
 * @returns A space-separated class string of static utilities.
 */
export function resolveTypographyRoleClass(
  role: TypographyRole,
  overrides?: Partial<TypographyRoleTokens>,
): string {
  if (!overrides) {
    return TYPOGRAPHY_ROLE_CLASS[role];
  }

  const base = TYPOGRAPHY_ROLE_TOKEN[role];
  const tokens: TypographyRoleTokens = {
    size: overrides.size ?? base.size,
    weight: overrides.weight ?? base.weight,
    leading: overrides.leading ?? base.leading,
    tracking: overrides.tracking ?? base.tracking,
  };

  return composeTypographyRoleClass(tokens);
}
