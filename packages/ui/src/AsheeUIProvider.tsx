"use client";

import { settingsController } from "@ashee/settings";
import { applyDesignTokens, injectResponsiveVars } from "@ashee/theme";
import { mergeObject } from "@ashee/utils";
import { MotionConfig } from "framer-motion";
import { type ReactNode, useLayoutEffect, useMemo } from "react";
import { defaultButtonSizeScale } from "./components/primitive/button/default-button-config";
import { flattenButtonSizeScale } from "./components/primitive/button/flatten-button-size-scale";
import type { ExternalConfig } from "./config";
import { AsheeConfigContext } from "./context";
import { defaultComponentConfig } from "./default-config";
import { defineConfig } from "./define-config";

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
    injectResponsiveVars(
      "ashee-button-tokens",
      flattenButtonSizeScale(
        config.components?.button?.size ?? defaultButtonSizeScale,
      ),
      config.theme.breakpoints,
    );
    settingsController.init(config.theme);
  }, [config]);

  return (
    <AsheeConfigContext.Provider value={config}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </AsheeConfigContext.Provider>
  );
}
