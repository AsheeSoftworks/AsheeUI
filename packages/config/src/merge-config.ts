import type { DeepPartial } from "./config";

function isPlainObject(item: unknown): item is Record<string, unknown> {
  return typeof item === "object" && item !== null && !Array.isArray(item);
}

export function mergeConfig<T extends Record<string, unknown>>(
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
      output[key] = mergeConfig(defaultValue, userValue);
    } else {
      output[key] = userValue;
    }
  }

  return output as T;
}
