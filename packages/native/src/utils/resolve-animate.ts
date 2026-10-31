/**
 * The platform's resolver for the `animate` press option.
 *
 * It is the cascade's rule in its smallest form — instance, then component configuration, then the
 * hard fallback — stated once so a component can resolve a boolean or a key without restating the
 * precedence. The web publishes the same function under the same name (`packages/web/src/utils/
 * resolve-animate.ts`); the two implementations are the renderers' own because the option they
 * resolve drives a different mechanism on each platform, but a shared file writes it once.
 *
 * It deliberately has no global-default tier: an animation setting belongs to the component that
 * animates, and inheriting a theme-wide default would make one component's motion policy another's.
 */

/**
 * Resolve a value for an animation or transition option.
 *
 * @param instance - The prop value passed directly to the component instance.
 * @param section - The value from the component's configuration section.
 * @param hardFallback - The final value when both are undefined.
 * @returns The resolved value, in precedence order.
 */
export function resolveAnimate<T>(
  instance: T | undefined,
  section: T | undefined,
  hardFallback: T,
): T {
  return instance ?? section ?? hardFallback;
}
