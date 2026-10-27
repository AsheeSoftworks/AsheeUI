/**
 * The native provider and configuration context.
 *
 * The provider resolves the configuration once and hands it to every component, so a
 * screen states its theme, its density and its per-component defaults in one place.
 * It performs no platform work beyond that: no theme script, no document, no storage,
 * because none of those exist on the platform and inventing replacements would be
 * native behaviour the web invented rather than the platform's own.
 *
 * One thing it does do, in development only, is say so when the styling pipeline is not
 * connected. A screen whose classes are all ignored renders with the right copy and no
 * style at all, which reads as a theme problem rather than a setup problem; the check in
 * `nativewind-doctor` turns that into one warning naming the cause. It costs nothing in
 * a production bundle, because the gate is `NODE_ENV`.
 */

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
} from "react";
import {
  type NativeConfig,
  type NativeExternalConfig,
  resolveNativeConfig,
} from "../config/resolve-config";
import { warnWhenStylingIsDisconnected } from "./nativewind-doctor";

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

  // After the first paint rather than during it: a warning is not a reason to render, and
  // the screen the reader is looking at is the evidence the message is about.
  useEffect(() => {
    warnWhenStylingIsDisconnected();
  }, []);

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
