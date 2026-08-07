import type { Radius, RadiusConfig } from "@ashee/config";

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
export function resolveScale<TKey extends string>(
  instance: TKey | undefined,
  section: TKey | undefined,
  globalDefault: TKey,
  values: Record<TKey, string>,
): string {
  return values[instance ?? section ?? globalDefault];
}
