import { useLayoutEffect } from "react";
import type { BreakpointConfig } from "./breakpoint-config";
import { defaultBreakpointConfig } from "./default-breakpoint-config";
import { injectResponsiveVars } from "./inject-responsive-vars";
import type { ResponsiveValue } from "./responsive";

const injectedCache = new Map<string, string>();

export function useResponsiveVars(
  id: string,
  vars: Record<string, ResponsiveValue<string>>,
  breakpoints: BreakpointConfig = defaultBreakpointConfig,
): void {
  useLayoutEffect(() => {
    const snapshot = JSON.stringify(vars);
    if (injectedCache.get(id) === snapshot) return; // an earlier instance already wrote this
    injectResponsiveVars(id, vars, breakpoints);
    injectedCache.set(id, snapshot);
  }, [id, vars, breakpoints]);
}
