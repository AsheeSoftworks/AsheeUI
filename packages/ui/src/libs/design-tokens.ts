import type { ColorConfig } from "../theme/color/color-config";
import type { RadiusConfig } from "../theme/radius/radius-config";
import type { ScrollbarConfig } from "../theme/scrollbar/scrollbar-config";
import type { ShadowConfig } from "../theme/shadow/shadow-config";
import type { TypographyConfig } from "../theme/typography/typography-config";

type DesignTokens = {
  color?: ColorConfig;
  radius: RadiusConfig;
  typography: TypographyConfig;
  shadow: ShadowConfig;
  defaultTheme?: string;
  scrollbar: ScrollbarConfig;
};

export const DESIGN_TOKENS_STYLE_ID = "ashee-design-tokens";

/**
 * Converts camelCase keys (e.g. `scrollbarThumb`, `scrollbarTrack`)
 * to kebab-case CSS variable suffixes (`scrollbar-thumb`, `scrollbar-track`).
 */
function toKebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

export function buildDesignTokensCss({
  color,
  radius,
  typography,
  shadow,
  scrollbar,
}: DesignTokens): string {
  // 1. Generate color theme CSS blocks
  const themeColorBlocks: string[] = [];

  if (color) {
    for (const [themeName, colorMap] of Object.entries(color)) {
      if (!colorMap) continue;

      const declarations = Object.entries(colorMap).map(
        ([key, val]) => `    --ashee-${toKebabCase(key)}: ${val};`,
      );

      themeColorBlocks.push(
        `.theme-${themeName} {\n${declarations.join("\n")}\n}`,
      );
    }
  }

  // 2. Safe lookups for radius and shadow defaults (prevents `undefined` in CSS)
  const defaultRadiusVal =
    radius?.values?.[radius?.default] ?? radius?.values?.md ?? "0.375rem";

  const defaultShadowVal =
    shadow?.values?.[shadow?.default] ??
    shadow?.values?.md ??
    "0 4px 6px -1px rgb(0 0 0 / 0.1)";

  // 3. Generate flat token declarations
  const flatDecls = [
    `--ashee-radius: ${defaultRadiusVal};`,
    ...Object.entries(radius?.values ?? {}).map(
      ([k, v]) => `--ashee-radius-${k}: ${v};`,
    ),
    `--ashee-shadow: ${defaultShadowVal};`,
    ...Object.entries(shadow?.values ?? {}).map(
      ([k, v]) => `--ashee-shadow-${k}: ${v};`,
    ),
    ...Object.entries(typography?.weight ?? {}).map(
      ([k, v]) => `--ashee-font-weight-${k}: ${v};`,
    ),
    ...Object.entries(typography?.lineHeight ?? {}).map(
      ([k, v]) => `--ashee-leading-${k}: ${v};`,
    ),
    ...Object.entries(typography?.letterSpacing ?? {}).map(
      ([k, v]) => `--ashee-tracking-${k}: ${v};`,
    ),
    ...Object.entries(scrollbar ?? {}).map(
      ([k, v]) => `--ashee-scrollbar-${toKebabCase(k)}: ${v};`,
    ),
  ];

  return `
${themeColorBlocks.join("\n\n")}

:root {
  ${flatDecls.join("\n  ")}
}`;
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
