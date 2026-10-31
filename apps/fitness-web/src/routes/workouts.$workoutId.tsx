import { workouts, WorkoutDetailScreen } from "@asheeui/fitness-shared";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ErrorState } from "asheeui";

export const Route = createFileRoute("/workouts/$workoutId")({
  component: WorkoutPage,
});

function WorkoutPage() {
  const { workoutId } = Route.useParams();
  const navigate = useNavigate();
  const workout = workouts.find((candidate) => candidate.id === workoutId);

  if (!workout) {
    return (
      <ErrorState
        title="That session is not in the library"
        description="The link may be from an older programme."
        onRetry={() => navigate({ to: "/workouts" })}
      />
    );
  }

  return (
    <WorkoutDetailScreen
      workout={workout}
      onBack={() => navigate({ to: "/workouts" })}
      onFinish={() => navigate({ to: "/workouts" })}
    />
  );
}
