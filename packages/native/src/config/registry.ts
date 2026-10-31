/**
 * Component configuration registry for the native package.
 *
 * The native implementation resolves its options the way the web implementation
 * does: through a cascade of instance prop, then component configuration, then the
 * platform default, then the value the component documents. A component registers
 * its defaults here as an import side effect, so a consumer's configuration is
 * merged with them without the consumer listing anything.
 *
 * **There is one registry, not two.** It is `@asheeui/core`'s `ComponentTypeConfigRegistry`
 * and its one `Map`: `registerNativeComponentDefaults` writes through
 * `registerComponentDefaults`, and `getNativeComponentDefaults` reads through
 * `getAllComponentDefaults`. Before B08 the platform kept a parallel map, which is why a
 * `components.button` the two renderers both know could be answered by two different
 * default tables depending on which one a component asked.
 *
 * The type is a *documented subset* rather than a second interface: `NativeComponentConfigRegistry`
 * extends core's, so every key core declares is known here, and a native config module narrows a key
 * to what its component actually implements — `NativeCardConfig` is `CardConfig` without the two
 * options a device leaves alone. An interface cannot be augmented with a differing type, which is
 * why the narrowing lives on this derived interface rather than on core's own.
 *
 * The cascade rule itself comes from `@asheeui/core`, so the two platforms cannot drift; what
 * differs per platform is a *value* (a native button's density is decided by touch targets), and
 * those stay in the renderer's own `default*Config`.
 */

import {
  type ComponentTypeConfigRegistry,
  getAllComponentDefaults,
  registerComponentDefaults,
} from "@asheeui/core";

/**
 * The registry of every native component's configuration type.
 *
 * It extends core's, so it is the same key set with this renderer's documented narrowings. Each
 * component's config module augments this interface with its own entry.
 */
export interface NativeComponentConfigRegistry
  extends ComponentTypeConfigRegistry {}

/**
 * Register a native component's default configuration.
 *
 * The write goes to the shared registry, so `getAllComponentDefaults()` and
 * `getNativeComponentDefaults()` answer from one table.
 *
 * @param name - The component key, in lower camel case (for example `"button"`).
 * @param config - The component's default configuration.
 */
export function registerNativeComponentDefaults<
  K extends keyof NativeComponentConfigRegistry,
>(name: K, config: NativeComponentConfigRegistry[K]): void {
  // The narrowing is the point: this renderer's type for a key is a subset of core's, and the
  // registry it writes to is typed by core's. These two casts state that relationship once, here,
  // rather than at each of the config modules that register — and they are safe by construction,
  // because the interface above extends core's.
  registerComponentDefaults(
    name as keyof ComponentTypeConfigRegistry,
    config as ComponentTypeConfigRegistry[keyof ComponentTypeConfigRegistry],
  );
}

/**
 * Read every registered default configuration.
 *
 * @returns The registered defaults, keyed by component name.
 */
export function getNativeComponentDefaults(): Partial<NativeComponentConfigRegistry> {
  return getAllComponentDefaults() as Partial<NativeComponentConfigRegistry>;
}
