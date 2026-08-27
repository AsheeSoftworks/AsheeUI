/// <reference path="./virtual-config.d.ts" />
"use client";

import externalConfig from "virtual:ashee-config";
import { type ReactNode, useMemo } from "react";
import { resolveConfig } from "./config/resolve-config";
import { AsheeConfigContext } from "./libs/context";
import { useIsomorphicLayoutEffect } from "./libs/use-isomorphic-layout-effect";
import { AsheeThemeScript } from "./scripts/AsheeThemeScript";
import { themeController } from "./theme/controller";

export interface AsheeUIProviderProps {
  children: ReactNode;
}

export function AsheeUIProvider({ children }: AsheeUIProviderProps) {
  const config = useMemo(() => resolveConfig(externalConfig ?? {}), []);

  useIsomorphicLayoutEffect(() => {
    themeController.configure({
      defaultTheme: config.defaultTheme ?? "system",
      themes: Object.keys(config.color),
    });
  }, [config]);

  return (
    <AsheeConfigContext.Provider value={config}>
      <AsheeThemeScript />
      {children}
    </AsheeConfigContext.Provider>
  );
}
