import type {
  ColorConfig,
  ColorVariant,
  ThemeName,
} from "../theme/color/color-config";

const VAR_MAP: Record<keyof ColorVariant, string> = {
  background: "--ashee-background",
  foreground: "--ashee-foreground",
  primary: "--ashee-primary",
  secondary: "--ashee-secondary",
  border: "--ashee-border",
  danger: "--ashee-danger",
  warning: "--ashee-warning",
  success: "--ashee-success",
  scrollbarThumb: "--ashee-scrollbar-thumb",
  scrollbarTrack: "--ashee-scrollbar-track",
};

function toCssBlock(name: ThemeName, v: ColorVariant): string {
  const decls = Object.entries(v)
    .map(([k, val]) => `  ${VAR_MAP[k as keyof ColorVariant]}: ${val};`)
    .join("\n");
  const selector = name === "light" ? ":root" : `.theme-${name}`;
  return `${selector} {\n${decls}\n}`;
}

/** Call once at startup with the merged config. Injects a <style> tag. */
export function applyThemeConfig(colors: ColorConfig): void {
  if (typeof document === "undefined") return; // SSR guard

  const css = (Object.entries(colors) as [ThemeName, ColorVariant][])
    .map(([name, v]) => toCssBlock(name, v))
    .join("\n\n");

  let el = document.getElementById(
    "ashee-theme-vars",
  ) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = "ashee-theme-vars";
    document.head.appendChild(el);
  }
  el.textContent = css;
}
