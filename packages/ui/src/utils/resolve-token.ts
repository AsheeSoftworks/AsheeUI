export function resolveCascade<T>(
  instance: T | undefined,
  section: T | undefined,
  globalDefault: T | undefined,
  hardFallback: T,
): T {
  return instance ?? section ?? globalDefault ?? hardFallback;
}

export function resolveAnimate<T>(
  instance: T | undefined,
  section: T | undefined,
  hardFallback: T,
): T {
  return instance ?? section ?? hardFallback;
}

export function resolveRadiusKey<TKey>(
  instanceProp: TKey | undefined,
  sectionConfig: TKey | undefined,
  globalDefaultRadius: TKey | undefined,
  hardFallback: TKey = "md" as TKey,
): TKey {
  return instanceProp ?? sectionConfig ?? globalDefaultRadius ?? hardFallback;
}

export function resolveClassKey<TKey extends PropertyKey>(
  key: TKey,
  classMap: Record<TKey, string>,
  fallbackKey: TKey,
): string {
  return classMap[key] ?? classMap[fallbackKey] ?? "";
}
