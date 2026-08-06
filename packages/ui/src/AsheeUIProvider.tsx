"use client";

import type { Config } from "@ashee/config";
import { settingsController } from "@ashee/settings";
import { applyDesignTokens } from "@ashee/theme";
import { type ReactNode, useLayoutEffect } from "react";

export interface AsheeUIProviderProps {
  config: Config;
  children: ReactNode;
}

export function AsheeUIProvider({ config, children }: AsheeUIProviderProps) {
  useLayoutEffect(() => {
    applyDesignTokens(config.theme);
    settingsController.init(config);
  }, [config]);

  return <>{children}</>;
}
