/**
 * React hook for accessing and manipulating theme state in AsheeUI.
 * This file provides the useTheme hook, which connects React components
 * to the theme controller's state via useSyncExternalStore, ensuring
 * components re-render when the theme changes. This is the primary
 * way for React components to interact with the theming system.
 */
"use client";
import { useSyncExternalStore } from "react";
import type { ThemeName } from "./color";
import { type ThemeSelection, themeController } from "./controller";

/**
 * React hook that provides access to the current theme state and controls.
 *
 * This hook subscribes to the theme controller and returns the current
 * theme selection, resolved theme name, and functions for changing the theme.
 * Components using this hook will re-render automatically when the theme changes.
 *
 * The hook uses useSyncExternalStore to safely subscribe to the theme
 * controller's state, making it compatible with React's concurrent rendering.
 *
 * @returns An object containing the current theme state and control functions.
 *
 * @example
 * ```tsx
 * function ThemeToggle() {
 *   const { theme, setTheme, availableThemes } = useTheme();
 *
 *   return (
 *     <select value={theme} onChange={(e) => setTheme(e.target.value as ThemeSelection)}>
 *       {availableThemes.map(t => (
 *         <option key={t} value={t}>{t}</option>
 *       ))}
 *       <option value="system">System</option>
 *     </select>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * function ThemedComponent() {
 *   const { resolvedTheme } = useTheme();
 *
 *   return (
 *     <div className={resolvedTheme === 'dark' ? 'dark-styles' : 'light-styles'}>
 *       Current theme: {resolvedTheme}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see ThemeController - The underlying class that manages theme state.
 * @see ThemeSelection - The type for theme selections including "system".
 * @see ThemeName - The type for resolved theme names.
 */
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
    /**
     * The user's current theme selection.
     * This can be either a specific theme name or "system".
     */
    theme,

    /**
     * The resolved theme name after applying the selection.
     * If the selection is "system", this resolves to either "light" or "dark"
     * based on the system preference.
     */
    resolvedTheme,

    /**
     * Function to set the theme selection.
     * This persists the selection to localStorage and applies the theme.
     * @param selection - The theme to select, either "system" or a theme name.
     */
    setTheme: themeController.setTheme,

    /**
     * Function to cycle to the next available theme.
     * This cycles through all available theme names, excluding "system".
     * Loops back to the start when reaching the end of the list.
     */
    toggleTheme: themeController.toggleTheme,

    /**
     * The list of available theme names in the application.
     * This does not include "system" as it is not a theme name.
     */
    availableThemes: themeController.getAvailableThemes(),
  };
}
