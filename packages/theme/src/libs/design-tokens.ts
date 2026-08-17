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

export const DESIGN_TOKENS_STYLE_ID = "ashee-design-tokens";

/**
 * Builds the full CSS string for the given design tokens.
 *
 * Pure and side-effect free — usable both on the server (to emit identical
 * markup into SSR HTML) and on the client (to hydrate/refresh the tokens).
 */
export function buildDesignTokensCss({
  radius,
  typography,
  shadow,
  breakpoints = defaultBreakpointConfig,
}: DesignTokens): string {
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
  ];

  const responsiveVars: Record<string, ResponsiveValue<string>> = {};
  for (const [key, value] of Object.entries(typography.size))
    responsiveVars[`--ashee-text-${key}`] = value;

  return `:root {\n  ${flatDecls.join("\n  ")}\n}\n\n${buildResponsiveCss(responsiveVars, breakpoints)}`;
}

export function applyDesignTokens(tokens: DesignTokens): void {
  if (typeof document === "undefined") return;

  const css = buildDesignTokensCss(tokens);

  let el = document.getElementById(
    DESIGN_TOKENS_STYLE_ID,
  ) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = DESIGN_TOKENS_STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = css;
}
