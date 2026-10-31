import type { AsheePuckData } from "@asheeui/fitness-shared";
import { StudioScreen } from "@asheeui/fitness-shared";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { readStudioPage } from "../pages/StudioEditor";
import { useGo } from "../lib/navigation";

export const Route = createFileRoute("/studio")({ component: StudioPage });

function StudioPage() {
  const navigate = useNavigate();
  const go = useGo();
  const [data, setData] = useState<AsheePuckData | undefined>();

  useEffect(() => {
    const stored = readStudioPage();
    if (stored) setData(stored as unknown as AsheePuckData);
  }, []);

  return (
    <StudioScreen
      onNavigate={go}
      onOpenWorkout={() => undefined}
      data={data}
      onEdit={() => navigate({ to: "/studio/edit" })}
    />
  );
}
