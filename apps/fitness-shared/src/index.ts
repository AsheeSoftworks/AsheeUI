/**
 * The shared fitness-tracker kit.
 *
 * Both demo applications depend on this package and on `asheeui`; neither imports a
 * renderer. The web app resolves `asheeui` to its DOM half, the Expo app to its platform
 * half, and these screens are the same source in both bundles.
 */
export * from "./components";
export * from "./data";
export * from "./screens/Dashboard";
export * from "./screens/Nutrition";
export * from "./screens/Progress";
export * from "./screens/Settings";
export * from "./screens/Studio";
export * from "./screens/WorkoutDetail";
export * from "./screens/Workouts";
export * from "./theme";
export * from "./theme-settings";

export type { AsheePuckData } from "@asheeui/puck";
