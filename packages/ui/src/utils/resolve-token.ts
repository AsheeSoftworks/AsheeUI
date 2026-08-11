import type { Radius, RadiusConfig } from "@ashee/theme";

export function resolveRadius(
  instanceProp: keyof Radius | undefined,
  sectionConfig: { radius?: keyof Radius } | undefined,
  globalRadius: RadiusConfig,
): string {
  const key = instanceProp ?? sectionConfig?.radius ?? globalRadius.default;
  return globalRadius.values[key];
}

/** 2-tier: instance prop wins, else the component config section's value, else a built-in fallback. */
export function resolveValue<T>(
  instance: T | undefined,
  section: T | undefined,
  fallback: T,
): T {
  return instance ?? section ?? fallback;
}

/** 3-tier: instance prop, else component config key, else the global theme's default key — resolved against a shared value scale. */
export function resolveScale<TKey extends PropertyKey, TValue = string>(
  instance: TKey | undefined,
  section: TKey | undefined,
  globalDefault: TKey,
  values: Record<TKey, TValue>,
): TValue {
  return values[instance ?? section ?? globalDefault];
}

export function resolveComponentScale<TKey extends PropertyKey, TValue>(
  instance: TKey | undefined,
  scale: { default: TKey; values: Record<TKey, TValue> },
): TValue {
  return scale.values[instance ?? scale.default];
}
