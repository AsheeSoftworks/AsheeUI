/**
 * Cascade resolution for AsheeUI, platform-neutral.
 *
 * Both implementations resolve a value through the same four tiers in the same
 * order, so a consumer learns one precedence rule and it holds on every platform.
 * The functions are pure and depend on nothing, which is what makes them shareable:
 * the web package maps the resolved value to a Tailwind class and the native
 * package maps it to a NativeWind class or a style object.
 */

/**
 * Resolves a value through the standard cascade.
 *
 * The precedence is instance prop, then the component's configuration section,
 * then the platform's global default, then the built-in fallback. An explicit
 * `false` or `0` is a decision rather than an absence, so only `undefined` falls
 * through to the next tier.
 *
 * @param instance - The value passed to a component instance.
 * @param section - The value from the component's configuration section.
 * @param globalDefault - The platform's global default for that axis.
 * @param hardFallback - The value the component documents.
 * @returns The resolved value.
 *
 * @example
 * ```ts
 * const variant = resolveCascade(props.variant, config.components.button?.variant, config.defaultVariant, "solid");
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
 * Resolves a whole option set in one step.
 *
 * A component with several options would otherwise repeat the same precedence rule
 * once per option, which is where the two platforms drift apart. The fallback
 * object defines the shape: every key it declares is resolved and returned, and a
 * key it omits has no fallback at all.
 *
 * @param instance - The options passed to the component instance.
 * @param section - The component's configuration section.
 * @param fallback - The hard fallback for every option.
 * @returns A complete set of resolved values.
 */
export function resolveConfigCascade<C extends object, F extends Required<C>>(
  instance: Partial<C>,
  section: Partial<C> | undefined,
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
