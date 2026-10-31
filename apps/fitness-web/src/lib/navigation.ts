import type { RouteKey } from "@asheeui/fitness-shared";
import { useNavigate } from "@tanstack/react-router";
import { ROUTE_PATHS } from "../shell/AppShell";

/** Navigate to a top-level destination from a shared screen's callback. */
export function useGo() {
  const navigate = useNavigate();
  return (route: RouteKey) => navigate({ to: ROUTE_PATHS[route] as "/" });
}

/** Open a workout from a shared screen's callback. */
export function useOpenWorkout() {
  const navigate = useNavigate();
  return (workoutId: string) =>
    navigate({ to: "/workouts/$workoutId", params: { workoutId } });
}
