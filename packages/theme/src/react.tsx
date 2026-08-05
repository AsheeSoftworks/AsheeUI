import type { ThemeName } from "@ashee/config";
import { useSyncExternalStore } from "react";
import { themeController } from "./controller";

export function useTheme() {
  const theme = useSyncExternalStore(
    themeController.subscribe,
    themeController.getTheme,
    () => "light" as ThemeName, // SSR snapshot
  );
  return { theme, setTheme: themeController.setTheme };
}
