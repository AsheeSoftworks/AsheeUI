import type { Config } from "../config/config";
import type { ColorConfig, ColorVariant } from "../theme/color";
import { THEME_STORAGE_KEY } from "../theme/controller";

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

export const THEME_VARS_STYLE_ID = "ashee-theme-vars";

function buildThemeCss(colors: ColorConfig): string {
  return Object.entries(colors)
    .map(([name, v]) => {
      const decls = Object.entries(v as ColorVariant)
        .map(([k, val]) => `  ${VAR_MAP[k as keyof ColorVariant]}: ${val};`)
        .join("\n");
      const selector =
        name === "light" ? ":root, .theme-light" : `.theme-${name}`;
      return `${selector} {\n${decls}\n}`;
    })
    .join("\n\n");
}

/**
 * Render a pre-paint theme script that applies the resolved theme class
 * and injects the theme CSS variables before first paint.
 *
 * The resolved {@link Config} is supplied by {@link AsheeProvider} so
 * runtime configuration never needs a bundler plugin or virtual module.
 */
export function AsheeThemeScript({ config }: { config: Config }) {
  const themes = Object.keys(config.color ?? {});
  const defaultTheme = config.defaultTheme ?? "system";
  const storageKey = THEME_STORAGE_KEY;
  const css = buildThemeCss(config.color);

  const script = `
    (function() {
      var el = document.documentElement;
      var storageKey = ${JSON.stringify(storageKey)};
      var defaultTheme = ${JSON.stringify(defaultTheme)};
      var themes = ${JSON.stringify(themes)};
      var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      var stored = null;
      try {
        stored = window.localStorage.getItem(storageKey);
      } catch (e) {}
      
      var selection = stored || defaultTheme;
      var resolved = selection === 'system' ? (systemDark ? 'dark' : 'light') : selection;
      
      var prefix = 'theme-';
      for (var i = el.classList.length - 1; i >= 0; i--) {
        if (el.classList[i].startsWith(prefix)) {
          el.classList.remove(el.classList[i]);
        }
      }
      el.classList.add(prefix + resolved);
      el.style.colorScheme = resolved;

      // Synchronously inject style tag before first paint
      var styleEl = document.getElementById(${JSON.stringify(THEME_VARS_STYLE_ID)});
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = ${JSON.stringify(THEME_VARS_STYLE_ID)};
        styleEl.textContent = ${JSON.stringify(css)};
        document.head.appendChild(styleEl);
      }
    })();
  `;

  return (
    <script
      id="ashee-theme-script"
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
