/**
 * Starter palettes for the gallery.
 *
 * These are content, not tokens: a reader can add one and then edit it, and the application can
 * replace this list with its own. Every colour is in the portable hex set and every preset extends
 * a built-in, so a preset is a valid runtime definition without further work.
 */
import type { ExternalColorConfig } from "@asheeui/core";

/** One palette a reader can start from. */
export interface ThemePreset {
  /** The name shown on the card. */
  name: string;

  /** The runtime key the preset is stored under. */
  slug: string;

  /** The definition, ready for `ExternalColorConfig`. */
  definition: ExternalColorConfig[string];
}

/** A small, deliberately different set of palettes. */
export const THEME_PRESETS: readonly ThemePreset[] = [
  {
    name: "Ocean",
    slug: "ocean",
    definition: {
      extends: "dark",
      background: "#08111f",
      foreground: "#e2e8f0",
      primary: "#38bdf8",
      secondary: "#111c2e",
      border: "#1e3a5f",
      danger: "#f87171",
      warning: "#fbbf24",
      success: "#34d399",
    },
  },
  {
    name: "Forest",
    slug: "forest",
    definition: {
      extends: "light",
      background: "#f7fbf7",
      foreground: "#14231a",
      primary: "#15803d",
      secondary: "#e7f2e9",
      border: "#c7dfcd",
      danger: "#b91c1c",
      warning: "#b45309",
      success: "#15803d",
    },
  },
  {
    name: "Sunset",
    slug: "sunset",
    definition: {
      extends: "dark",
      background: "#1a0f14",
      foreground: "#fce7f3",
      primary: "#fb7185",
      secondary: "#2a1620",
      border: "#4c1d2e",
      danger: "#f43f5e",
      warning: "#f59e0b",
      success: "#10b981",
    },
  },
  {
    name: "Mono",
    slug: "mono",
    definition: {
      extends: "light",
      background: "#ffffff",
      foreground: "#111111",
      primary: "#111111",
      secondary: "#f4f4f5",
      border: "#d4d4d8",
      danger: "#dc2626",
      warning: "#a16207",
      success: "#166534",
    },
  },
];
