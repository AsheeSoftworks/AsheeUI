"use client";

import { defineConfig, type ExternalConfig } from "@ashee/config";
import { settingsController } from "@ashee/settings";
import { applyDesignTokens } from "@ashee/theme";
import { mergeObject } from "@ashee/utils";
import { MotionConfig } from "framer-motion";
import { type ReactNode, useLayoutEffect, useMemo } from "react";
import { AsheeConfigContext } from "./context";
import { defaultComponentConfig } from "./default-config";

export interface AsheeUIProviderProps {
  config?: ExternalConfig;
  children: ReactNode;
}

export function AsheeUIProvider({
  config: externalConfig,
  children,
}: AsheeUIProviderProps) {
  const config = useMemo(() => {
    const themeConfig = defineConfig(externalConfig ?? {});
    const components = mergeObject(
      defaultComponentConfig,
      externalConfig?.components ?? {},
    );
    return { ...themeConfig, components };
  }, [externalConfig]);

  useLayoutEffect(() => {
    applyDesignTokens(config.theme);
    settingsController.init(config);
  }, [config]);

  return (
    <AsheeConfigContext.Provider value={config}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </AsheeConfigContext.Provider>
  );
}
