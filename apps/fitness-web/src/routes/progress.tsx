import { ProgressScreen } from "@asheeui/fitness-shared";
import { createFileRoute } from "@tanstack/react-router";
import { useGo, useOpenWorkout } from "../lib/navigation";

export const Route = createFileRoute("/progress")({ component: ProgressPage });

function ProgressPage() {
  const go = useGo();
  const open = useOpenWorkout();
  return <ProgressScreen onNavigate={go} onOpenWorkout={open} />;
}
