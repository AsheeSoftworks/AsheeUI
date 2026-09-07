"use client";

import { createContext, useContext } from "react";
import type { Config } from "../config/config";

export const AsheeConfigContext = createContext<Config | null>(null);

export function useAsheeConfig(): Config {
  const config = useContext(AsheeConfigContext);
  if (!config) {
    throw new Error(
      "useAsheeConfig must be used within an AsheeProvider - wrap your app root with <AsheeProvider>.",
    );
  }
  return config;
}

/** Alias for {@link useAsheeConfig}, exported from the `asheeui` root. */
export const useAshee = useAsheeConfig;
