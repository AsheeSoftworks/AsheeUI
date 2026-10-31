/**
 * The application's shared configuration and navigation model.
 *
 * The config is the same object on both apps: one theme default, one radius and a few
 * component overrides from the cascade. It is typed with `ExternalConfig` from
 * `asheeui`, so a consumer never reaches into `@asheeui/core` to name the shape.
 */
import type { ExternalConfig } from "asheeui";

/** The identifier of a top-level destination. */
export type RouteKey =
  | "dashboard"
  | "workouts"
  | "nutrition"
  | "progress"
  | "studio"
  | "settings";

/** One entry in the app's navigation. */
export interface Destination {
  key: RouteKey;
  label: string;
  /** A short glyph, used where an icon set is not available on both platforms. */
  glyph: string;
  description: string;
}

/** The six destinations, in the order both shells present them. */
export const destinations: Destination[] = [
  {
    key: "dashboard",
    label: "Today",
    glyph: "◉",
    description: "Your day at a glance",
  },
  {
    key: "workouts",
    label: "Workouts",
    glyph: "◈",
    description: "The training library",
  },
  {
    key: "nutrition",
    label: "Nutrition",
    glyph: "◆",
    description: "Meals and macros",
  },
  {
    key: "progress",
    label: "Progress",
    glyph: "▲",
    description: "Records and consistency",
  },
  {
    key: "studio",
    label: "Studio",
    glyph: "✦",
    description: "Your composed dashboard",
  },
  {
    key: "settings",
    label: "Settings",
    glyph: "⚙",
    description: "Theme, goals and account",
  },
];

/**
 * Navigate to a top-level destination.
 *
 * The shells own the router, so a shared screen calls this and never imports one. The
 * optional workout is the one detail destination below the top level.
 */
export type Navigate = (route: RouteKey) => void;

/** Open a workout's detail screen. */
export type OpenWorkout = (workoutId: string) => void;

/** What every shared screen receives from its shell. */
export interface ScreenProps {
  onNavigate: Navigate;
  onOpenWorkout: OpenWorkout;
}

/**
 * The configuration both applications pass to `AsheeUIProvider`.
 *
 * The light and dark palettes are retuned in place, so `defaultTheme: "system"` follows the
 * platform while both sides carry the product's colours. `citrus` and `lagoon` are extra
 * choices the header's theme picker offers; the presets in Settings add more.
 */
export const config: ExternalConfig = {
  defaultTheme: "system",
  defaultColor: "primary",
  defaultVariant: "solid",
  defaultRadius: "lg",
  color: {
    light: {
      background: "#fff7f2",
      foreground: "#241a16",
      primary: "#be123c",
      secondary: "#ffe3d3",
      border: "#f1c3ad",
      danger: "#b91c1c",
      warning: "#a16207",
      success: "#0f766e",
      scrollbarThumb: "#be123c",
      scrollbarTrack: "#ffe3d3",
    },
    dark: {
      background: "#0b1020",
      foreground: "#f4f1ff",
      primary: "#7c3aed",
      secondary: "#171b34",
      border: "#303655",
      danger: "#fb7185",
      warning: "#fbbf24",
      success: "#2dd4bf",
      scrollbarThumb: "#a78bfa",
      scrollbarTrack: "#171b34",
    },
    citrus: {
      extends: "light",
      background: "#f7fee7",
      foreground: "#1a2e05",
      primary: "#4d7c0f",
      secondary: "#ecfccb",
      border: "#bef264",
      danger: "#b91c1c",
      warning: "#a16207",
      success: "#0f766e",
      scrollbarThumb: "#4d7c0f",
      scrollbarTrack: "#ecfccb",
    },
    lagoon: {
      extends: "dark",
      background: "#061a1b",
      foreground: "#ecfeff",
      primary: "#0e7490",
      secondary: "#0d2b2e",
      border: "#155e63",
      danger: "#fb7185",
      warning: "#fbbf24",
      success: "#34d399",
      scrollbarThumb: "#22d3ee",
      scrollbarTrack: "#0d2b2e",
    },
  },
  components: {
    button: { radius: "full" },
    badge: { radius: "full" },
    card: { radius: "xl" },
  },
};
