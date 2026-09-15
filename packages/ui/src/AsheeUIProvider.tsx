/**
 * Root provider component for AsheeUI.
 * This file provides the AsheeUIProvider component that wraps the application
 * and initializes the theming system, configuration context, and pre-paint
 * theme script. It resolves the user-provided configuration against defaults
 * and component-registered defaults, then makes the configuration available
 * throughout the component tree via React context.
 */
"use client";

import { type ReactNode, useMemo, useSyncExternalStore } from "react";
import type { ExternalConfig } from "./config/config";
import { resolveConfig } from "./config/resolve-config";
import { assertValidConfig } from "./config/validate-config";
import { AsheeConfigContext } from "./libs/context";
import { useIsomorphicLayoutEffect } from "./libs/use-isomorphic-layout-effect";
import {
  AsheeThemeScript,
  ensureThemeVarsStyle,
} from "./scripts/AsheeThemeScript";
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
 * No-op subscription for {@link useRendersServerOutput}: the value it reads only
 * differs between the server and the client, so nothing can change it later.
 */
const subscribeToHydration = () => () => {};

/**
 * Whether React is producing the server output, or hydrating that output,
 * rather than mounting into a client that has no server markup behind it.
 *
 * React uses the server snapshot for both of those, so this is the signal the
 * pre-paint theme script needs: a browser runs that script while it parses the
 * server markup, and it is inert anywhere else.
 *
 * @returns `true` while rendering on the server or hydrating, `false` after
 *   hydration completes and on a client-only mount.
 */
function useRendersServerOutput(): boolean {
  return useSyncExternalStore(
    subscribeToHydration,
    () => false,
    () => true,
  );
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
  const resolvedConfig = useMemo(() => {
    // Validated once per configuration object (M3, `U-4`): invalid values throw
    // while rendering the provider, unknown keys warn in development only.
    assertValidConfig(config);
    return resolveConfig(config);
  }, [config]);

  useIsomorphicLayoutEffect(() => {
    themeController.configure({
      defaultTheme: resolvedConfig.defaultTheme ?? "system",
      themes: Object.keys(resolvedConfig.color),
    });

    // The pre-paint script injects the theme variables while the server HTML is
    // parsed. A client-only render never runs it, so they are applied here
    // instead, still before the first paint. This is a no-op once the script has
    // done it.
    ensureThemeVarsStyle(resolvedConfig);
  }, [resolvedConfig]);

  // The pre-paint script only pays off where the HTML it sits in is parsed by a
  // browser, which is the server output and the hydration of that output. A
  // client-only render cannot run a script React creates, so the element would
  // be dead markup and React warns about it.
  const renderPrePaintScript = useRendersServerOutput();

  return (
    <AsheeConfigContext.Provider value={resolvedConfig}>
      {renderPrePaintScript && <AsheeThemeScript config={resolvedConfig} />}
      {children}
    </AsheeConfigContext.Provider>
  );
}
