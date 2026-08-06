import type { ThemeName } from "@ashee/config";
import { useSyncExternalStore } from "react";
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
  return { theme, resolvedTheme, setTheme: themeController.setTheme };
}
