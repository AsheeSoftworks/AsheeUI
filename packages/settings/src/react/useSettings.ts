import { useSyncExternalStore } from "react";
import { settingsController } from "../store";
import { defaultUserSettings } from "../types";

export function useSettings() {
  const settings = useSyncExternalStore(
    settingsController.subscribe,
    settingsController.getSettings,
    () => defaultUserSettings, // SSR snapshot
  );
  return { settings, update: settingsController.update };
}
