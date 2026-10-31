/**
 * The device shell's theme state.
 *
 * AsyncStorage is asynchronous while the controller's storage contract is synchronous. The
 * adapter below keeps the current selection in memory and mirrors it to AsyncStorage, and the
 * startup read fills that cache before the provider mounts. Definitions are loaded first for the
 * same reason: a stored selection for a runtime theme must have a palette when the controller
 * first validates it.
 */
import {
  config,
  parseStoredThemes,
  type AppThemes,
  ThemeSettingsProvider,
  THEME_DEFINITIONS_KEY,
} from "@asheeui/fitness-shared";
import {
  AsheeUIProvider,
  THEME_STORAGE_KEY,
} from "asheeui";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

/** The selection cache the controller reads synchronously. */
let cachedSelection: string | null = null;

const themeStorage = {
  get: () => cachedSelection,
  set: (value: string) => {
    cachedSelection = value;
    void AsyncStorage.setItem(THEME_STORAGE_KEY, value);
  },
  remove: () => {
    cachedSelection = null;
    void AsyncStorage.removeItem(THEME_STORAGE_KEY);
  },
};

/** The device shell's provider and persisted runtime themes. */
export function ThemeRoot({ children }: { children: React.ReactNode }) {
  const [themes, setThemes] = useState<AppThemes | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([
      AsyncStorage.getItem(THEME_DEFINITIONS_KEY),
      AsyncStorage.getItem(THEME_STORAGE_KEY),
    ])
      .then(([storedThemes, storedSelection]) => {
        if (!active) return;

        cachedSelection = storedSelection;
        let parsed: unknown = null;
        try {
          parsed = storedThemes ? JSON.parse(storedThemes) : null;
        } catch {
          parsed = null;
        }

        setThemes(parseStoredThemes(parsed, config));
      })
      .catch(() => {
        if (active) setThemes({});
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!themes) return;
    void AsyncStorage.setItem(THEME_DEFINITIONS_KEY, JSON.stringify(themes));
  }, [themes]);

  if (!themes) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ThemeSettingsProvider themes={themes} onChange={setThemes}>
      <AsheeUIProvider
        config={config}
        themes={themes}
        persistTheme={themeStorage}
      >
        {children}
      </AsheeUIProvider>
    </ThemeSettingsProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
