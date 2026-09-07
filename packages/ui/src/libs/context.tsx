/**
 * React context and hooks for accessing the AsheeUI configuration.
 * This file provides the AsheeConfigContext and the useAsheeConfig hook
 * for consuming the global configuration throughout the component tree.
 * The configuration includes theme settings, component defaults, and
 * other global settings that components can access via this context.
 */
"use client";

import { createContext, useContext } from "react";
import type { Config } from "../config/config";

/**
 * React context for the AsheeUI configuration.
 * Holds the global Config object that provides theme settings,
 * component defaults, and other library-wide configuration.
 * This context is populated by the AsheeUIProvider component.
 */
export const AsheeConfigContext = createContext<Config | null>(null);

/**
 * Hook that returns the AsheeUI configuration from context.
 * Must be used within a component tree wrapped by AsheeUIProvider.
 * Throws an error if used outside of the provider.
 *
 * @returns The current AsheeUI Config object.
 *
 * @throws {Error} When used outside of an AsheeUIProvider.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const config = useAsheeConfig();
 *   const theme = config.theme;
 *   // Use the configuration...
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Wrapping the app root
 * function App() {
 *   return (
 *     <AsheeUIProvider config={myConfig}>
 *       <MyComponent />
 *     </AsheeUIProvider>
 *   );
 * }
 * ```
 */
export function useAsheeConfig(): Config {
  const config = useContext(AsheeConfigContext);
  if (!config) {
    throw new Error(
      "useAsheeConfig must be used within an AsheeUIProvider - wrap your app root with <AsheeUIProvider>.",
    );
  }
  return config;
}

/**
 * Alias for {@link useAsheeConfig}, exported from the `asheeui` root.
 * Provides a shorter name for convenience when importing from the main package.
 *
 * @example
 * ```tsx
 * import { useAshee } from 'asheeui';
 *
 * function MyComponent() {
 *   const config = useAshee();
 *   // Same as useAsheeConfig()
 * }
 * ```
 */
export const useAshee = useAsheeConfig;
