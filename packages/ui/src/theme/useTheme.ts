"use client";
import { useSyncExternalStore } from "react";
import type { ThemeName } from "./color";
import { type ThemeSelection, themeController } from "./controller";

export function useTheme() {
  const theme = useSyncExternalStore(
    themeController.subscribe,
    themeController.getSelection,
    () => "light" as ThemeSelection,
  );

  const resolvedTheme = useSyncExternalStore(
    themeController.subscribe,
    themeController.getResolvedTheme,
    () => "light" as ThemeName,
  );

  return {
    theme,
    resolvedTheme,
    setTheme: themeController.setTheme,
    toggleTheme: themeController.toggleTheme,
    availableThemes: themeController.getAvailableThemes(),
  };
}
