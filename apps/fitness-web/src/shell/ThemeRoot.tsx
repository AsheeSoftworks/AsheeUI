/**
 * The web shell's theme state.
 *
 * The definitions come from localStorage after hydration, which keeps the server and the first
 * client render identical: the provider starts from the configured themes and the stored runtime
 * definitions arrive in an effect. The stored selection is captured before the provider's first
 * layout effect, because that effect may treat a runtime selection as stale while the definitions
 * are still loading; once the definitions are present, the selection is restored.
 *
 * The selection itself is the existing `ashee-theme` key. Only the definitions use `pulse.themes`.
 */
"use client";

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
  type ThemeSelection,
  useTheme,
} from "asheeui";
import { type ReactNode, useEffect, useRef, useState } from "react";

/** Read the stored definitions, or an empty map when the key is absent or malformed. */
function readStoredThemes(): AppThemes {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(THEME_DEFINITIONS_KEY);
    if (!raw) return {};
    return parseStoredThemes(JSON.parse(raw), config);
  } catch {
    return {};
  }
}

/** Capture the reader's selection before the provider can decide it is stale. */
function readStoredSelection(): ThemeSelection | null {
  if (typeof window === "undefined") return null;
  return (window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeSelection) ?? null;
}

/**
 * Put back a stored runtime selection once its definition exists.
 *
 * The provider treats a selection with no palette as stale on its first configure; while the
 * definitions are loading, that is exactly what a runtime theme looks like. This child runs after
 * the provider's configuration, so restoring the captured value validates it against the map that
 * has now arrived.
 */
function RestoreSelection({
  selection,
  themes,
  loaded,
}: {
  selection: ThemeSelection | null;
  themes: AppThemes;
  loaded: boolean;
}) {
  const { setTheme } = useTheme();
  const restored = useRef(false);

  useEffect(() => {
    if (!loaded || restored.current) return;
    restored.current = true;
    if (!selection) return;

    if (
      selection === "system" ||
      selection === "light" ||
      selection === "dark" ||
      selection in themes
    ) {
      setTheme(selection);
    }
  }, [loaded, selection, themes, setTheme]);

  return null;
}

/** The web shell's provider and persisted runtime themes. */
export function ThemeRoot({ children }: { children: ReactNode }) {
  const [themes, setThemes] = useState<AppThemes>({});
  const [loaded, setLoaded] = useState(false);
  const [selection] = useState<ThemeSelection | null>(() => readStoredSelection());

  useEffect(() => {
    setThemes(readStoredThemes());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(THEME_DEFINITIONS_KEY, JSON.stringify(themes));
  }, [loaded, themes]);

  return (
    <ThemeSettingsProvider themes={themes} onChange={setThemes}>
      <AsheeUIProvider config={config} themes={themes}>
        <RestoreSelection selection={selection} themes={themes} loaded={loaded} />
        {children}
      </AsheeUIProvider>
    </ThemeSettingsProvider>
  );
}
