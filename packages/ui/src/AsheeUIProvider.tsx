/**
 * Root provider component for AsheeUI.
 * This file provides the AsheeUIProvider component that wraps the application
 * and initializes the theming system, configuration context, and pre-paint
 * theme script. It resolves the user-provided configuration against defaults
 * and component-registered defaults, then makes the configuration available
 * throughout the component tree via React context.
 */
"use client";

import { type ReactNode, useMemo } from "react";
import type { ExternalConfig } from "./config/config";
import { resolveConfig } from "./config/resolve-config";
import { AsheeConfigContext } from "./libs/context";
import { useIsomorphicLayoutEffect } from "./libs/use-isomorphic-layout-effect";
import { AsheeThemeScript } from "./scripts/AsheeThemeScript";
import { themeController } from "./theme/controller";

/**
 * Props for the AsheeUIProvider component.
 */
export interface AsheeUIProviderProps {
  /**
   * Optional partial runtime config merged over the library defaults.
   *
   * Pass the object exported by an `asheeui.config.*` file (or any
   * inline {@link ExternalConfig}) to customize colors, radius, theme
   * defaults and per-component options at runtime.
   */
  config?: ExternalConfig;

  /**
   * The child components to render within the provider context.
   */
  children: ReactNode;
}

/**
 * Runtime configuration provider.
 *
 * Resolves {@link AsheeUIProviderProps.config} against the library
 * defaults and exposes the resulting config through React context
 * (consumed via `useAsheeConfig` / `useAshee`). Theme controller
 * setup and the pre-paint theme script are wired automatically.
 *
 * This component must wrap the root of your application to enable
 * all AsheeUI features. It sets up the theme system, config context,
 * and ensures the theme is applied before the initial paint.
 *
 * @param props - The component props.
 * @param props.config - Optional custom configuration.
 * @param props.children - The child elements.
 * @returns The provider component with theme and configuration context.
 *
 * @example
 * ```tsx
 * import { AsheeUIProvider } from "asheeui";
 * import config from "./asheeui.config";
 *
 * export function Providers({ children }) {
 *   return <AsheeUIProvider config={config}>{children}</AsheeUIProvider>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Inline configuration
 * <AsheeUIProvider
 *   config={{
 *     defaultTheme: 'dark',
 *     defaultVariant: 'ghost',
 *     components: {
 *       Button: { radius: 'lg' }
 *     }
 *   }}
 * >
 *   <App />
 * </AsheeUIProvider>
 * ```
 *
 * @see useAsheeConfig - Hook for accessing the resolved configuration.
 * @see AsheeThemeScript - Component that applies theme class before paint.
 */
export function AsheeUIProvider({
  config = {},
  children,
}: AsheeUIProviderProps) {
  const resolvedConfig = useMemo(() => resolveConfig(config), [config]);

  useIsomorphicLayoutEffect(() => {
    themeController.configure({
      defaultTheme: resolvedConfig.defaultTheme ?? "system",
      themes: Object.keys(resolvedConfig.color),
    });
  }, [resolvedConfig]);

  return (
    <AsheeConfigContext.Provider value={resolvedConfig}>
      <AsheeThemeScript config={resolvedConfig} />
      {children}
    </AsheeConfigContext.Provider>
  );
}
