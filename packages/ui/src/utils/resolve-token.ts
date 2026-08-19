/**
 * 4-Tier Cascade Resolver:
 * 1. Component instance prop (<Button variant="solid" />)
 * 2. Component section config from provider (config.components.button.variant)
 * 3. Global theme default from provider (config.theme.defaultVariant)
 * 4. Hardcoded library fallback ("bordered")
 */
export function resolveCascade<T>(
  instance: T | undefined,
  section: T | undefined,
  globalDefault: T | undefined,
  hardFallback: T,
): T {
  return instance ?? section ?? globalDefault ?? hardFallback;
}

/**
 * Resolves a radius token KEY (e.g., "md") rather than a raw CSS value string.
 */
export function resolveRadiusKey<TKey extends string = string>(
  instanceProp: TKey | undefined,
  sectionConfig: { radius?: TKey } | undefined,
  globalDefaultRadius: TKey | undefined,
  hardFallback: TKey = "md" as TKey,
): TKey {
  return (
    instanceProp ?? sectionConfig?.radius ?? globalDefaultRadius ?? hardFallback
  );
}

/**
 * Safely looks up a class from a class map with a guaranteed fallback key.
 */
export function resolveClassKey<TKey extends PropertyKey>(
  key: TKey,
  classMap: Record<TKey, string>,
  fallbackKey: TKey,
): string {
  return classMap[key] ?? classMap[fallbackKey] ?? "";
}

/**
 * Resolves a spacing token KEY (e.g., "md") rather than a raw CSS value string.
 * Accepts section config objects (with `gap`, `spacing`, `padding`, or `margin`) or direct token values.
 */
export function resolveSpacingKey<TKey extends string = string>(
  instanceProp: TKey | undefined,
  sectionConfig: Record<string, unknown> | TKey | undefined,
  globalDefaultSpacing: TKey | undefined,
  hardFallback: TKey = "md" as TKey,
): TKey {
  let sectionValue: TKey | undefined;

  if (typeof sectionConfig === "object" && sectionConfig !== null) {
    const candidate =
      sectionConfig.gap ??
      sectionConfig.spacing ??
      sectionConfig.padding ??
      sectionConfig.margin;

    if (typeof candidate === "string") {
      sectionValue = candidate as TKey;
    }
  } else if (typeof sectionConfig === "string") {
    sectionValue = sectionConfig;
  }

  return instanceProp ?? sectionValue ?? globalDefaultSpacing ?? hardFallback;
}
