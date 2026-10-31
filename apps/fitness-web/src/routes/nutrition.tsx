import { NutritionScreen } from "@asheeui/fitness-shared";
import { createFileRoute } from "@tanstack/react-router";
import { useGo, useOpenWorkout } from "../lib/navigation";

export const Route = createFileRoute("/nutrition")({ component: NutritionPage });

function NutritionPage() {
  const go = useGo();
  const open = useOpenWorkout();
  return <NutritionScreen onNavigate={go} onOpenWorkout={open} />;
}
