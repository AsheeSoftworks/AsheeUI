/**
 * The React binding both renderers publish.
 *
 * The body is the web hook's, because the contract is the same five fields and the same
 * external store. A shared component calls `useTheme()` and never learns which platform it
 * is on.
 */

"use client";

import type { ThemeName } from "@asheeui/core";
import { useSyncExternalStore } from "react";
import { type ThemeSelection, themeController } from "./controller";

/**
 * Read and change the application's theme.
 *
 * @returns The selection, the resolved theme, the two ways to change it, and the names a
 *   picker offers.
 *
 * @example
 * ```tsx
 * function ThemePicker() {
 *   const { theme, setTheme, availableThemes } = useTheme();
 *
 *   return availableThemes.map((name) => (
 *     <Button key={name} onPress={() => setTheme(name)}>
 *       {name}
 *     </Button>
 *   ));
 * }
 * ```
 */
export function useTheme(): {
  theme: ThemeSelection;
  resolvedTheme: ThemeName;
  setTheme: (selection: ThemeSelection) => void;
  toggleTheme: () => void;
  availableThemes: readonly ThemeName[];
} {
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
