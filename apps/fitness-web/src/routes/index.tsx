import { DashboardScreen } from "@asheeui/fitness-shared";
import { createFileRoute } from "@tanstack/react-router";
import { useGo, useOpenWorkout } from "../lib/navigation";

export const Route = createFileRoute("/")({ component: DashboardPage });

function DashboardPage() {
  const go = useGo();
  const open = useOpenWorkout();
  return <DashboardScreen onNavigate={go} onOpenWorkout={open} />;
}
