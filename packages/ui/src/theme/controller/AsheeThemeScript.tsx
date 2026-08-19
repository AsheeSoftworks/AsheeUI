/// <reference path="../../virtual-config.d.ts" />
import externalConfig from "virtual:ashee-config";
import { resolveConfig } from "../../config/resolve-config";
import {
  buildDesignTokensCss,
  DESIGN_TOKENS_STYLE_ID,
} from "../../libs/design-tokens";
import { THEME_STORAGE_KEY } from "./controller";

const isServer = typeof window === "undefined";

export function AsheeThemeScript() {
  // 1. Skip client-side rendering entirely so React 19 never attempts
  //    to reconcile a <script> element on the client.
  if (!isServer) return null;

  const config = resolveConfig(externalConfig ?? {});
  const tokensCss = buildDesignTokensCss(config.theme);
  const themes = Object.keys(config.theme.color);
  const defaultTheme = config.theme.defaultTheme ?? "system";
  const storageKey = THEME_STORAGE_KEY;

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
      
      // Apply theme class
      var prefix = 'theme-';
      for (var i = el.classList.length - 1; i >= 0; i--) {
        if (el.classList[i].startsWith(prefix)) {
          el.classList.remove(el.classList[i]);
        }
      }
      el.classList.add(prefix + resolved);
      el.style.colorScheme = resolved;
      
      // Apply design tokens
      var styleEl = document.getElementById(${JSON.stringify(DESIGN_TOKENS_STYLE_ID)});
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = ${JSON.stringify(DESIGN_TOKENS_STYLE_ID)};
        styleEl.textContent = ${JSON.stringify(tokensCss)};
        document.head.appendChild(styleEl);
      }
    })();
  `;

  return (
    <script
      id="ashee-theme-script"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for zero-flicker theme initialization
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
