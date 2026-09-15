/**
 * Utility functions for resolving cascade values in AsheeUI.
 * This file provides helper functions that implement the configuration
 * precedence hierarchy: instance prop > component config > theme default > hard fallback.
 * These utilities are used throughout the component library to resolve
 * values like variant, color, size, and radius.
 */

import type { DeepPartial } from "./types";

/**
 * Resolves a value using the standard cascade precedence order.
 * Follows the hierarchy: instance prop > component config > global default > hard fallback.
 * This is the primary resolver for most component props.
 *
 * @param instance - The prop value passed directly to the component instance.
 * @param section - The value from the component's configuration section.
 * @param globalDefault - The global default value from the theme configuration.
 * @param hardFallback - The final fallback value if all others are undefined.
 * @returns The resolved value.
 *
 * @example
 * ```tsx
 * const variant = resolveCascade(
 *   props.variant,          // 'ghost'
 *   config.Button.variant,  // 'solid'
 *   theme.defaultVariant,   // 'faded'
 *   'solid'                 // hard fallback
 * );
 * // Returns 'ghost' because instance prop takes precedence
 * ```
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
 * Resolves a value for animation or transition contexts.
 * Similar to resolveCascade but without the global default tier.
 * This is useful for values that should not inherit from theme defaults.
 *
 * @param instance - The prop value passed directly to the component instance.
 * @param section - The value from the component's configuration section.
 * @param hardFallback - The final fallback value if all others are undefined.
 * @returns The resolved value.
 *
 * @example
 * ```tsx
 * const animate = resolveAnimate(
 *   props.animate,           // false
 *   config.Button.animate,   // true
 *   true                     // hard fallback
 * );
 * // Returns false because instance prop takes precedence
 * ```
 */
export function resolveAnimate<T>(
  instance: T | undefined,
  section: T | undefined,
  hardFallback: T,
): T {
  return instance ?? section ?? hardFallback;
}

/**
 * Resolves a radius value using the standard cascade precedence order.
 * This is a specialized version of resolveCascade that provides a default
 * hard fallback of "md" for radius values.
 *
 * @param instanceProp - The radius prop passed directly to the component instance.
 * @param sectionConfig - The radius from the component's configuration section.
 * @param globalDefaultRadius - The global default radius from the theme.
 * @param hardFallback - Optional custom fallback, defaults to "md".
 * @returns The resolved radius key.
 *
 * @example
 * ```tsx
 * const radius = resolveRadiusKey(
 *   props.radius,          // 'lg'
 *   config.Button.radius,  // 'md'
 *   theme.defaultRadius,   // 'sm'
 * );
 * // Returns 'lg' because instance prop takes precedence
 * ```
 */
export function resolveRadiusKey<TKey>(
  instanceProp: TKey | undefined,
  sectionConfig: TKey | undefined,
  globalDefaultRadius: TKey | undefined,
  hardFallback: TKey = "md" as TKey,
): TKey {
  return instanceProp ?? sectionConfig ?? globalDefaultRadius ?? hardFallback;
}

/**
 * Resolve every option of a component's configuration in one step.
 *
 * A layout or pattern component usually exposes its whole configuration as a
 * set of optional props that resolve through the same cascade. Calling
 * {@link resolveCascade} once per key repeats the same precedence rule and the
 * same fallback argument for every option, which is where drift creeps in. This
 * helper applies the rule to every key of the hard fallback in one call, so a
 * component states its options once and the precedence is guaranteed to be
 * identical for all of them.
 *
 * The fallback object defines the shape: every key it declares is resolved and
 * returned, and a key it omits has no fallback at all (which is how optional
 * responsive keys stay undefined).
 *
 * @param instance - The props passed to the component instance.
 * @param section - The component's configuration section, if any.
 * @param fallback - The hard fallback for every option.
 * @returns A complete set of resolved values.
 *
 * @example
 * ```tsx
 * const resolved = resolveConfigCascade<HeroConfig, Required<HeroConfig>>(
 *   { align, spacing, background },
 *   config.components?.hero,
 *   FALLBACK_HERO_CONFIG,
 * );
 * // resolved.align is the prop, then components.hero.align, then the fallback
 * ```
 */
export function resolveConfigCascade<C extends object, F extends Required<C>>(
  instance: Partial<C>,
  section: DeepPartial<C> | undefined,
  fallback: F,
): F {
  const resolved: Record<string, unknown> = { ...fallback };
  const sectionValues = section as Record<string, unknown> | undefined;

  for (const key of Object.keys(fallback)) {
    const instanceValue = (instance as Record<string, unknown>)[key];
    const sectionValue = sectionValues?.[key];

    resolved[key] =
      instanceValue ??
      sectionValue ??
      (fallback as Record<string, unknown>)[key];
  }

  return resolved as F;
}

/**
 * Resolves a CSS class from a class map based on a key.
 * Returns the class string for the given key, falling back to the
 * fallback key's class if the key is not found. Returns an empty
 * string if neither the key nor the fallback key exist in the map.
 *
 * @param key - The key to look up in the class map.
 * @param classMap - The record mapping keys to CSS class strings.
 * @param fallbackKey - The fallback key to use if the primary key is not found.
 * @returns The CSS class string.
 *
 * @example
 * ```tsx
 * const classes = resolveClassKey(
 *   'lg',                          // key
 *   { sm: 'text-sm', lg: 'text-lg' }, // classMap
 *   'sm'                           // fallbackKey
 * );
 * // Returns 'text-lg'
 * ```
 *
 * @example
 * ```tsx
 * const classes = resolveClassKey(
 *   'xl',                          // key not in map
 *   { sm: 'text-sm', lg: 'text-lg' }, // classMap
 *   'sm'                           // fallbackKey
 * );
 * // Returns 'text-sm' from fallback key
 * ```
 */
export function resolveClassKey<TKey extends PropertyKey>(
  key: TKey,
  classMap: Record<TKey, string>,
  fallbackKey: TKey,
): string {
  return classMap[key] ?? classMap[fallbackKey] ?? "";
}
