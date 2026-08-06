import type { Config } from "@ashee/config";

type DesignTokens = Pick<Config["theme"], "radius" | "typography" | "shadow">;

export function applyDesignTokens({
  radius,
  typography,
  shadow,
}: DesignTokens): void {
  if (typeof document === "undefined") return;

  const decls: string[] = [
    `--ashee-radius: ${radius.values[radius.default]};`,
    ...Object.entries(radius.values).map(
      ([k, v]) => `--ashee-radius-${k}: ${v};`,
    ),

    `--ashee-shadow: ${shadow.values[shadow.default]};`,
    ...Object.entries(shadow.values).map(
      ([k, v]) => `--ashee-shadow-${k}: ${v};`,
    ),

    ...Object.entries(typography.size).map(
      ([k, v]) => `--ashee-text-${k}: ${v};`,
    ),
    ...Object.entries(typography.weight).map(
      ([k, v]) => `--ashee-font-weight-${k}: ${v};`,
    ),
    ...Object.entries(typography.lineHeight).map(
      ([k, v]) => `--ashee-leading-${k}: ${v};`,
    ),
    ...Object.entries(typography.spacing).map(
      ([k, v]) => `--ashee-tracking-${k}: ${v};`,
    ),
    ...Object.entries(typography.family).map(
      ([k, v]) => `--ashee-font-${k}: ${v};`,
    ),
  ];

  const css = `:root {\n  ${decls.join("\n  ")}\n}`;

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
