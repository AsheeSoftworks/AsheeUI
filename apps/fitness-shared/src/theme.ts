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

/** The configuration both applications pass to `AsheeUIProvider`. */
export const config: ExternalConfig = {
  defaultTheme: "system",
  defaultColor: "primary",
  defaultVariant: "solid",
  defaultRadius: "lg",
  components: {
    button: { radius: "full" },
    badge: { radius: "full" },
    card: { radius: "xl" },
  },
};
