import { SettingsScreen } from "@asheeui/fitness-shared";
import { createFileRoute } from "@tanstack/react-router";
import { useGo, useOpenWorkout } from "../lib/navigation";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const go = useGo();
  const open = useOpenWorkout();
  return <SettingsScreen onNavigate={go} onOpenWorkout={open} />;
}
