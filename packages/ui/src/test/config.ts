/**
 * Configuration helper (`TEST-023`).
 *
 * Builds valid global configuration objects for tests, so a test only states
 * the configuration it actually cares about. Invalid-configuration failure
 * semantics are not yet defined (`U-4`, `ROAD-009`), so no invalid-config
 * helper exists yet: inventing one would assert behaviour the framework has
 * not committed to.
 */

import type { ExternalConfig } from "../config/config";

/**
 * Build a valid external configuration.
 *
 * @param overrides - Configuration values for the test.
 * @returns A configuration object ready to pass to the provider.
 *
 * @example
 * ```tsx
 * renderWithProvider(<Button />, { config: makeConfig({ defaultVariant: "ghost" }) });
 * ```
 */
export function makeConfig(overrides: ExternalConfig = {}): ExternalConfig {
  return { ...overrides };
}

/**
 * Build a configuration that overrides one component's options.
 *
 * @param component - Registered component key (for example `"button"`).
 * @param props - Component options to override.
 * @returns A configuration object with a single component override.
 */
export function makeComponentConfig(
  component: keyof NonNullable<ExternalConfig["components"]>,
  props: Record<string, unknown>,
): ExternalConfig {
  return {
    components: { [component]: props },
  } as ExternalConfig;
}
