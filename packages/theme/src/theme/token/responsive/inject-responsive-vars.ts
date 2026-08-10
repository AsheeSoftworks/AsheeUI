import type { BreakpointConfig } from "./breakpoint-config";
import { defaultBreakpointConfig } from "./default-breakpoint-config";
import type { ResponsiveValue } from "./responsive";
import { buildResponsiveCss } from "./responsive-css";

export function injectResponsiveVars(
  id: string,
  vars: Record<string, ResponsiveValue<string>>,
  breakpoints: BreakpointConfig = defaultBreakpointConfig,
): void {
  if (typeof document === "undefined") return;
  let el = document.getElementById(id) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = buildResponsiveCss(vars, breakpoints);
}
