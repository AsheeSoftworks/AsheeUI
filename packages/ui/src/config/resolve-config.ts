/**
 * Configuration resolution for AsheeUI.
 * This file provides the resolveConfig function that merges user-provided
 * configuration with defaults and component-registered defaults. It handles
 * the complete configuration resolution pipeline, including color resolution
 * which requires special handling for custom theme inheritance.
 */

import { getAllComponentDefaults } from "../libs/registry";
import { defaultColorConfig } from "../theme";
import { mergeObject } from "../utils";
import type { Config, ExternalConfig } from "./config";
import { defaultConfig } from "./default-config";
import { resolveColorConfig } from "./resolve-color";

/**
 * Resolves the final configuration by merging user-provided external
 * configuration with default configuration and component-registered defaults.
 *
 * The resolution pipeline follows this order:
 * 1. Start with the default configuration.
 * 2. Merge in component-registered defaults from the registry.
 * 3. Merge in the user-provided external configuration.
 * 4. Resolve the color configuration separately to handle custom theme inheritance.
 *
 * @param externalConfig - The user-provided external configuration.
 * @returns The fully resolved configuration.
 *
 * @example
 * ```tsx
 * const config = resolveConfig({
 *   defaultTheme: 'dark',
 *   components: {
 *     Button: { variant: 'ghost' }
 *   }
 * });
 * ```
 */
export function resolveConfig(externalConfig: ExternalConfig): Config {
  const registeredDefaults = getAllComponentDefaults() as Config["components"];

  // No explicit `<Config>` type argument: `mergeObject` infers `T` from
  // `defaultConfig` and treats the override object as its own type parameter,
  // avoiding a forced full `DeepPartial<Config>` instantiation at the call
  // site while still validating each override against `Config`.
  const configWithDefaults = mergeObject(defaultConfig, {
    components: registeredDefaults,
  });
  const merged = mergeObject(configWithDefaults, externalConfig);

  // generic mergeObject can't fall back keys it has no default for (custom themes) -
  // re-resolve color specifically so unfilled fields inherit from `light` or `dark`
  merged.color = resolveColorConfig(defaultColorConfig, externalConfig.color);

  return merged;
}
