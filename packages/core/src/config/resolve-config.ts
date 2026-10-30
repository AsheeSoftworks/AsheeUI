/**
 * Configuration resolution for the web renderer.
 *
 * This is the resolver the web's `AsheeUIProvider` calls: defaults merged with the consumer's
 * configuration, the palette resolved for inheritance, and `components` exposed as a lazy getter over
 * the registry.
 *
 * **The platform's resolver is `@asheeui/native`'s `resolveNativeConfig`**, and the two share every
 * rule this file states: the cascade (`resolveConfigCascade`), the merge (`mergeObject`), the palette
 * (`resolveColorConfig`, including the family a custom theme with no `extends` inherits) and the
 * validation (`assertValidConfig`). What differs is the *values*: the device adds `defaultSize`, which
 * has no meaning to a pointer, and states its own density and radius baselines. That is the whole
 * difference, and it is stated in native's `NATIVE_FALLBACK_CONFIG` rather than here.
 */

import { getAllComponentDefaults } from "../registry";
import { defaultColorConfig } from "../theme";
import { mergeObject } from "../utils";
import type { Config, ExternalConfig } from "./config";
import { defaultConfig } from "./default-config";
import { resolveColorConfig } from "./resolve-color";

/**
 * Resolves the final configuration by merging user-provided external
 * configuration with the default configuration. Component-registered defaults
 * are merged later, when `components` is read (see below).
 *
 * The resolution pipeline follows this order:
 * 1. Start with the default configuration.
 * 2. Merge in the user-provided external configuration.
 * 3. Resolve the color configuration separately to handle custom theme inheritance.
 *
 * Component-registered defaults are not part of this pipeline. The resolved
 * object exposes `components` as a lazy getter that merges the registry with the
 * user's component configuration (which wins) on every access, because the
 * registry is populated as component modules are evaluated and may still be
 * incomplete at resolve time.
 *
 * @param externalConfig - The user-provided external configuration.
 * @returns The fully resolved configuration.
 *
 * @example
 * ```tsx
 * const config = resolveConfig({
 *   defaultTheme: 'dark',
 *   components: {
 *     // The key is the component's registration name, not its export name.
 *     button: { variant: 'ghost' }
 *   }
 * });
 * ```
 */
export function resolveConfig(externalConfig: ExternalConfig): Config {
  // No explicit `<Config>` type argument: `mergeObject` infers `T` from
  // `defaultConfig` and treats the override object as its own type parameter,
  // avoiding a forced full `DeepPartial<Config>` instantiation at the call
  // site while still validating each override against `Config`.
  const merged = mergeObject(defaultConfig, externalConfig);

  // generic mergeObject can't fall back keys it has no default for (custom themes) -
  // re-resolve color specifically so unfilled fields inherit from `light` or `dark`.
  // A custom theme that states no `extends` inherits the application's default theme
  // family, so an app that defaults to dark does not get a light-based custom theme.
  merged.color = resolveColorConfig(
    defaultColorConfig,
    externalConfig.color,
    externalConfig.defaultTheme === "dark" ? "dark" : "light",
  );

  // Component defaults live in a module-level registry that each component's
  // config module populates as an import side effect (`registerComponentDefaults`).
  // Bundlers are free to evaluate those modules *after* the provider first
  // resolves the config — code-split client chunks and per-route module graphs
  // make this common — which would freeze a partially populated registry into
  // the config. A component would then fall back to the global defaults while
  // the server, which evaluates the whole graph before rendering, used its
  // registered defaults, producing a hydration mismatch on the rendered classes.
  //
  // Resolving `components` lazily guarantees every access reflects the registry
  // at the moment a component renders, and a component always imports its own
  // config module, so its entry is guaranteed to be registered by then.
  Object.defineProperty(merged, "components", {
    enumerable: true,
    configurable: true,
    get: () =>
      mergeObject(
        getAllComponentDefaults() as Record<string, unknown>,
        externalConfig.components as Record<string, unknown> | undefined,
      ) as Config["components"],
  });

  return merged;
}
