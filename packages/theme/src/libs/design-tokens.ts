import type { ShadowConfig } from "../theme/shadow/shadow-config";
import type { RadiusConfig } from "../theme/token/radius/radius-config";
import type { BreakpointConfig } from "../theme/token/responsive/breakpoint-config";
import { defaultBreakpointConfig } from "../theme/token/responsive/default-breakpoint-config";
import type { ResponsiveValue } from "../theme/token/responsive/responsive";
import { buildResponsiveCss } from "../theme/token/responsive/responsive-css";
import type { TypographyConfig } from "../theme/typography/typography-config";

type DesignTokens = {
  radius: RadiusConfig;
  typography: TypographyConfig;
  shadow: ShadowConfig;
  breakpoints?: BreakpointConfig;
};

export function applyDesignTokens({
  radius,
  typography,
  shadow,
  breakpoints = defaultBreakpointConfig,
}: DesignTokens): void {
  if (typeof document === "undefined") return;

  const flatDecls = [
    `--ashee-radius: ${radius.values[radius.default]};`,
    ...Object.entries(radius.values).map(
      ([k, v]) => `--ashee-radius-${k}: ${v};`,
    ),
    `--ashee-shadow: ${shadow.values[shadow.default]};`,
    ...Object.entries(shadow.values).map(
      ([k, v]) => `--ashee-shadow-${k}: ${v};`,
    ),
    ...Object.entries(typography.weight).map(
      ([k, v]) => `--ashee-font-weight-${k}: ${v};`,
    ),
    ...Object.entries(typography.lineHeight).map(
      ([k, v]) => `--ashee-leading-${k}: ${v};`,
    ),
    ...Object.entries(typography.letterSpacing).map(
      ([k, v]) => `--ashee-tracking-${k}: ${v};`,
    ),
    ...Object.entries(typography.family).map(
      ([k, v]) => `--ashee-font-${k}: ${v};`,
    ),
  ];

  const responsiveVars: Record<string, ResponsiveValue<string>> = {};
  for (const [key, value] of Object.entries(typography.size))
    responsiveVars[`--ashee-text-${key}`] = value;

  const css = `:root {\n  ${flatDecls.join("\n  ")}\n}\n\n${buildResponsiveCss(responsiveVars, breakpoints)}`;

  let el = document.getElementById(
    "ashee-design-tokens",
  ) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = "ashee-design-tokens";
    document.head.appendChild(el);
  }
  el.textContent = css;
}
