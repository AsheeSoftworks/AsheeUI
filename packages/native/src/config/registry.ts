/**
 * Component configuration registry for the native package.
 *
 * The native implementation resolves its options the way the web implementation
 * does: through a cascade of instance prop, then component configuration, then the
 * platform default, then the value the component documents. A component registers
 * its defaults here as an import side effect, so a consumer's configuration is
 * merged with them without the consumer listing anything.
 *
 * The registry is per platform because the defaults are: a native button's density
 * is decided by touch targets, and a web button's by pointer precision. The cascade
 * rule itself comes from `@asheeui/shared`, so the two platforms cannot drift.
 */

/**
 * The registry of every native component's configuration type.
 * Each component's config module augments this interface with its own entry.
 */
// biome-ignore lint/suspicious/noEmptyInterface: Required for the dynamic type insertion
export interface NativeComponentConfigRegistry {}

/**
 * The registered defaults, keyed by component name.
 */
const defaultsRegistry = new Map<string, unknown>();

/**
 * Register a native component's default configuration.
 *
 * @param name - The component key, in lower camel case (for example `"button"`).
 * @param config - The component's default configuration.
 */
export function registerNativeComponentDefaults<
  K extends keyof NativeComponentConfigRegistry,
>(name: K, config: NativeComponentConfigRegistry[K]): void {
  defaultsRegistry.set(name as string, config);
}

/**
 * Read every registered default configuration.
 *
 * @returns The registered defaults, keyed by component name.
 */
export function getNativeComponentDefaults(): Partial<NativeComponentConfigRegistry> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of defaultsRegistry.entries()) {
    result[key] = value;
  }

  return result as Partial<NativeComponentConfigRegistry>;
}
