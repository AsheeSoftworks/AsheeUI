/**
 * The native provider and configuration context.
 *
 * The provider resolves the configuration once and hands it to every component, so a
 * screen states its theme, its density and its per-component defaults in one place.
 * It performs no platform work beyond that: no theme script, no document, no storage,
 * because none of those exist on the platform and inventing replacements would be
 * native behaviour the web invented rather than the platform's own.
 */

import { createContext, type ReactNode, useContext, useMemo } from "react";
import {
  type NativeConfig,
  type NativeExternalConfig,
  resolveNativeConfig,
} from "../config/resolve-config";

/**
 * The configuration context.
 * `null` means the application did not wrap its tree, which the hook reports as a
 * mistake rather than silently defaulting.
 */
export const AsheeNativeConfigContext = createContext<NativeConfig | null>(
  null,
);

/**
 * Props for the native provider.
 */
export interface AsheeNativeProviderProps {
  /** The application's configuration, if it has one. */
  config?: NativeExternalConfig;

  /** The application tree. */
  children: ReactNode;
}

/**
 * Provide the resolved configuration to every native component below it.
 *
 * @param props - The configuration and the tree.
 * @returns The provider element.
 *
 * @example
 * ```tsx
 * <AsheeNativeProvider config={{ defaultRadius: "lg", components: { button: { size: "lg" } } }}>
 *   <App />
 * </AsheeNativeProvider>
 * ```
 */
export function AsheeNativeProvider({
  config,
  children,
}: AsheeNativeProviderProps) {
  const value = useMemo(() => resolveNativeConfig(config), [config]);

  return (
    <AsheeNativeConfigContext.Provider value={value}>
      {children}
    </AsheeNativeConfigContext.Provider>
  );
}

/**
 * Read the resolved native configuration.
 *
 * @returns The configuration provided by {@link AsheeNativeProvider}.
 * @throws When a component is rendered outside the provider, because a missing
 * provider is a setup mistake and defaulting silently would hide it.
 */
export function useAsheeNativeConfig(): NativeConfig {
  const config = useContext(AsheeNativeConfigContext);

  if (!config) {
    throw new Error(
      "useAsheeNativeConfig must be used within an AsheeNativeProvider - wrap your app root with <AsheeNativeProvider>.",
    );
  }

  return config;
}
