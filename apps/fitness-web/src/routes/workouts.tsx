import { WorkoutsScreen } from "@asheeui/fitness-shared";
import { createFileRoute } from "@tanstack/react-router";
import { useGo, useOpenWorkout } from "../lib/navigation";

export const Route = createFileRoute("/workouts")({ component: WorkoutsPage });

function WorkoutsPage() {
  const go = useGo();
  const open = useOpenWorkout();
  return <WorkoutsScreen onNavigate={go} onOpenWorkout={open} />;
}
