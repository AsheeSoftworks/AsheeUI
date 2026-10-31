/**
 * The web's resolver for the `animate` press option.
 *
 * It is the cascade's rule in its smallest form — instance, then component configuration, then the
 * hard fallback — and it stays generic so a component can state it once for a boolean or a key. The
 * platform resolves the same option through its own animation (B13), which is why the function is
 * the renderer's rather than the contract's.
 */

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
 *   props.animate,                // false
 *   config.components?.button?.animate, // true
 *   true                          // hard fallback
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
