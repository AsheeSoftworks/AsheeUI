import type { BreakpointConfig } from "./breakpoint-config";
import { BREAKPOINT_KEYS, type ResponsiveValue } from "./responsive";

export function buildResponsiveCss(
  vars: Record<string, ResponsiveValue<string>>,
  breakpoints: BreakpointConfig,
): string {
  const baseDecls = Object.entries(vars)
    .map(([name, v]) => `  ${name}: ${v.base};`)
    .join("\n");

  const mediaBlocks = BREAKPOINT_KEYS.map((bp) => {
    const decls = Object.entries(vars)
      .filter(([, v]) => v[bp] !== undefined)
      .map(([name, v]) => `    ${name}: ${v[bp]};`)
      .join("\n");
    return decls
      ? `@media (min-width: ${breakpoints[bp]}) {\n  :root {\n${decls}\n  }\n}`
      : "";
  }).filter(Boolean);

  return [`:root {\n${baseDecls}\n}`, ...mediaBlocks].join("\n\n");
}
