/// <reference path="./virtual-config.d.ts" />
"use client";

import externalConfig from "virtual:ashee-config";
import { applyDesignTokens, themeController } from "@ashee/theme";
import { MotionConfig } from "framer-motion";
import { type ReactNode, useEffect, useMemo } from "react";
import { resolveConfig } from "./config/resolve-config";
import { AsheeConfigContext } from "./libs/context";

export interface AsheeUIProviderProps {
  children: ReactNode;
}

export function AsheeUIProvider({ children }: AsheeUIProviderProps) {
  const config = useMemo(() => resolveConfig(externalConfig ?? {}), []);

  useEffect(() => {
    applyDesignTokens(config.theme);
    themeController.mount(); // Safe: runs post-hydration
  }, [config]);

  return (
    <AsheeConfigContext.Provider value={config}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </AsheeConfigContext.Provider>
  );
}
