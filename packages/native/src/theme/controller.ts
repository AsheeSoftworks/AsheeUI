/**
 * The native adapter for the shared theme controller.
 *
 * The state machine is core's (B11): one selection, one stored preference, the same six
 * rules as the web. What is left here is the platform's half — `Appearance` for the
 * operating system's scheme, an in-memory store by default, and no paint callback at all,
 * because the provider repaints from the controller's subscription.
 *
 * **Storage is injected, never installed.** The framework adds no storage package: a device
 * whose preference must survive a restart supplies an adapter through the provider's
 * `persistTheme` prop (an AsyncStorage wrapper, an Expo key-value store, anything with get,
 * set and remove). Without one the adapter below keeps the value for the session, which is
 * what "no dependency" means — and what the documentation states.
 *
 * **The default adapter lives at module scope.** `Appearance.addChangeListener` is the
 * platform's subscription, and the controller subscribes once, at creation. A provider that
 * called `configure` on every render would accumulate listeners; this module creates one
 * controller and one subscription for the whole application, exactly as the web module
 * creates one for the document.
 */

import {
  createThemeController,
  type ThemeStorage,
} from "@asheeui/core";
import { Appearance } from "react-native";

/**
 * The session-only store.
 *
 * A module-level value rather than a React ref, because the controller outlives any
 * component: a provider unmounts and remounts (a navigation transition, a screen reload) and
 * the reader's choice should still be there.
 */
let sessionValue: string | null = null;

const sessionStorage: ThemeStorage = {
  get: () => sessionValue,
  set: (value) => {
    sessionValue = value;
  },
  remove: () => {
    sessionValue = null;
  },
};

/**
 * The store the controller reads and writes.
 *
 * A level of indirection so an application can replace the session store with one that
 * persists without recreating the controller — and so the provider can install the adapter
 * it was given before the controller is configured.
 */
let activeStorage: ThemeStorage = sessionStorage;

/**
 * Install the application's storage adapter, or fall back to the session store.
 *
 * @param storage - The adapter to use, or `undefined` for the session-only default.
 */
export function setThemeStorage(storage: ThemeStorage | undefined): void {
  activeStorage = storage ?? sessionStorage;
}

/**
 * The theme controller an application shares.
 */
export const themeController = createThemeController({
  // The platform reports `null` when it has no preference; light is the documented default.
  systemScheme: () => Appearance.getColorScheme() ?? "light",

  onSystemChange: (listener) => {
    const subscription = Appearance.addChangeListener(() => listener());
    return () => subscription.remove();
  },

  storage: {
    get: () => activeStorage.get(),
    set: (value) => activeStorage.set(value),
    remove: () => activeStorage.remove(),
  },
});

export { THEME_STORAGE_KEY, type ThemeSelection } from "@asheeui/core";
export type { ThemeConfigInput, ThemeStorage } from "@asheeui/core";
