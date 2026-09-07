"use client";

import { type ReactNode, useMemo } from "react";
import type { ExternalConfig } from "./config/config";
import { resolveConfig } from "./config/resolve-config";
import { AsheeConfigContext } from "./libs/context";
import { useIsomorphicLayoutEffect } from "./libs/use-isomorphic-layout-effect";
import { AsheeThemeScript } from "./scripts/AsheeThemeScript";
import { themeController } from "./theme/controller";

export interface AsheeProviderProps {
  /**
   * Optional partial runtime config merged over the library defaults.
   *
   * Pass the object exported by an `asheeui.config.*` file (or any
   * inline {@link ExternalConfig}) to customize colors, radius, theme
   * defaults and per-component options at runtime.
   */
  config?: ExternalConfig;
  children: ReactNode;
}

/**
 * Runtime configuration provider.
 *
 * Resolves {@link AsheeProviderProps.config} against the library
 * defaults and exposes the resulting config through React context
 * (consumed via `useAsheeConfig` / `useAshee`). Theme controller
 * setup and the pre-paint theme script are wired automatically.
 *
 * @example
 * ```tsx
 * import { AsheeProvider } from "asheeui";
 * import config from "./asheeui.config";
 *
 * export function Providers({ children }) {
 *   return <AsheeProvider config={config}>{children}</AsheeProvider>;
 * }
 * ```
 */
export function AsheeProvider({ config = {}, children }: AsheeProviderProps) {
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
