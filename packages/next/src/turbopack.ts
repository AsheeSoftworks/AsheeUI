import { VIRTUAL_ID } from "./generate";

/**
 * The part of Next's Turbopack config that this package patches.
 *
 * Next exposes the same shape both at the stable `turbopack` key
 * (`>= 15.1`) and at the deprecated `experimental.turbo` key, so one
 * structural type covers both merge targets.
 */
export interface TurbopackPatch {
  /** Alias map used to redirect module specifiers during resolution. */
  resolveAlias?: Record<string, string>;
}

/**
 * Point `virtual:ashee-config` at the generated shim inside a Turbopack
 * config section.
 *
 * The given `target` object is mutated and then returned so the caller
 * can use it in an inline expression.
 *
 * @param target - Turbopack config section (stable or experimental).
 * @param shimPath - Project-root-relative path of the generated shim.
 * @returns The same `target` object, with the alias registered.
 *
 * @example
 * ```ts
 * const turbopack = addAsheeConfigResolveAlias(
 *   { resolveAlias: {} },
 *   "./.ashee/generated-config.mjs",
 * );
 * ```
 */
export function addAsheeConfigResolveAlias(
  target: TurbopackPatch,
  shimPath: string,
): TurbopackPatch {
  target.resolveAlias ??= {};
  target.resolveAlias[VIRTUAL_ID] = shimPath;
  return target;
}
