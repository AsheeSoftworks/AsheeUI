/**
 * Configuration definition helper for AsheeUI.
 * This file provides a utility function for defining configuration objects
 * with type safety, making it easier for users to create and export their
 * custom configurations.
 */

import type { ExternalConfig } from "./config";

/**
 * Helper function for defining AsheeUI configuration.
 * Provides type safety and autocomplete when creating a configuration object.
 *
 * @param config - The external configuration object to define.
 * @returns The same configuration object, with type checking applied.
 *
 * @example
 * ```tsx
 * // ashee.config.ts
 * import { defineConfig } from 'asheeui';
 *
 * export const config = defineConfig({
 *   defaultTheme: 'dark',
 *   defaultVariant: 'ghost',
 *   components: {
 *     Button: {
 *       radius: 'lg'
 *     }
 *   }
 * });
 * ```
 */
export function defineConfig(config: ExternalConfig): ExternalConfig {
  return config;
}
