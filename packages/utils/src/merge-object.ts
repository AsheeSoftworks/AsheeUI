import type { DeepPartial } from "./types";

/**
 * Test whether `item` is a plain object (not `null`, not an array).
 *
 * @param item - Value to inspect.
 * @returns `true` when `item` is a non-array object.
 */
function isPlainObject(item: unknown): item is Record<string, unknown> {
  return typeof item === "object" && item !== null && !Array.isArray(item);
}

/**
 * Deeply merge a partial user config over a set of defaults.
 *
 * Nested plain objects are merged recursively; arrays and scalar
 * values from `userConfig` replace the default outright. Keys whose
 * user value is `undefined` are skipped, leaving the default intact.
 * The `defaults` object is not mutated.
 *
 * @param defaults - Baseline object providing fallback values.
 * @param userConfig - Optional partial override object.
 * @returns A new object with the user overrides applied.
 *
 * @example
 * ```ts
 * const config = mergeObject(
 *   { theme: { color: "primary", radius: "md" } },
 *   { theme: { radius: "lg" } },
 * );
 * // -> { theme: { color: "primary", radius: "lg" } }
 * ```
 */
export function mergeObject<T extends Record<string, unknown>>(
  defaults: T,
  userConfig?: DeepPartial<T>,
): T {
  if (!userConfig) {
    return defaults;
  }

  const output: Record<string, unknown> = { ...defaults };
  const defaultsRecord = defaults as Record<string, unknown>;
  const userRecord = userConfig as Record<string, unknown>;

  for (const key of Object.keys(userConfig)) {
    const userValue = userRecord[key];
    const defaultValue = defaultsRecord[key];

    if (userValue === undefined) continue;

    if (isPlainObject(defaultValue) && isPlainObject(userValue)) {
      output[key] = mergeObject(defaultValue, userValue);
    } else {
      output[key] = userValue;
    }
  }

  return output as T;
}
