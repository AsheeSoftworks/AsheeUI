import { createContext, useContext } from "react";
import type { Config } from "./config";

export const AsheeConfigContext = createContext<Config | null>(null);

export function useAsheeConfig(): Config {
  const config = useContext(AsheeConfigContext);
  if (!config) {
    throw new Error(
      "useAsheeConfig must be used within an AsheeUIProvider — wrap your app root with <AsheeUIProvider>.",
    );
  }
  return config;
}
