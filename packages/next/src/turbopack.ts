import { VIRTUAL_ID } from "./generate";

/**
 * The part of Next's Turbopack config we patch. Next exposes this both at the
 * stable `turbopack` key (>= 15.1) and the deprecated experimental key, and
 * both carry the same shape, so one structural type covers both merge
 * targets.
 */
export interface TurbopackPatch {
  resolveAlias?: Record<string, string>;
}

/**
 * Point `virtual:ashee-config` at the generated shim inside a Turbopack
 * config section (returning the same object for chaining).
 */
export function addAsheeConfigResolveAlias(
  target: TurbopackPatch,
  shimPath: string,
): TurbopackPatch {
  target.resolveAlias ??= {};
  target.resolveAlias[VIRTUAL_ID] = shimPath;
  return target;
}
