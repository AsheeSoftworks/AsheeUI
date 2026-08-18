/// <reference path="./virtual-config.d.ts" />
"use client";

import externalConfig from "virtual:ashee-config";
import { MotionConfig } from "framer-motion";
import { type ReactNode, useEffect, useMemo } from "react";
import { resolveConfig } from "./config/resolve-config";
import { AsheeConfigContext } from "./libs/context";
import { themeController } from "./libs/controller";
import { applyDesignTokens } from "./libs/design-tokens";

export interface AsheeUIProviderProps {
  children: ReactNode;
}

export function AsheeUIProvider({ children }: AsheeUIProviderProps) {
  const config = useMemo(() => resolveConfig(externalConfig ?? {}), []);

  useEffect(() => {
    applyDesignTokens(config.theme);
    themeController.mount();
  }, [config]);

  return (
    <AsheeConfigContext.Provider value={config}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </AsheeConfigContext.Provider>
  );
}
