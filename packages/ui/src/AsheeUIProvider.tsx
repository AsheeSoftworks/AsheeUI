/// <reference path="./virtual-config.d.ts" />
"use client";

import externalConfig from "virtual:ashee-config";
import { MotionConfig } from "framer-motion";
import { type ReactNode, useMemo } from "react";
import { resolveConfig } from "./config/resolve-config";
import { AsheeConfigContext } from "./libs/context";
import { applyDesignTokens } from "./libs/design-tokens";
import { useIsomorphicLayoutEffect } from "./libs/use-isomorphic-layout-effect";
import { AsheeThemeScript } from "./theme/controller/AsheeThemeScript";
import { themeController } from "./theme/controller/controller";

export interface AsheeUIProviderProps {
  children: ReactNode;
}

export function AsheeUIProvider({ children }: AsheeUIProviderProps) {
  const config = useMemo(() => resolveConfig(externalConfig ?? {}), []);

  useIsomorphicLayoutEffect(() => {
    applyDesignTokens(config.theme);
    themeController.configure({
      defaultTheme: config.theme.defaultTheme ?? "system",
      themes: Object.keys(config.theme.color),
    });
  }, [config]);

  return (
    <AsheeConfigContext.Provider value={config}>
      <AsheeThemeScript />
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </AsheeConfigContext.Provider>
  );
}
