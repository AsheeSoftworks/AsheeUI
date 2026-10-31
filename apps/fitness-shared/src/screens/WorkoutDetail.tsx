/**
 * One workout, in full.
 *
 * The detail screen is where a member spends the session: the movement list, a set log, a
 * rest timer and the finish confirmation. It exercises `Accordion`, `Stepper`, `Form`,
 * the field family, `RadioGroup`, `Switch`, `Spinner`, `Alert`, `Tooltip` and `Modal`.
 */
import {
  Accordion,
  Alert,
  Badge,
  Button,
  Form,
  Grid,
  HStack,
  Input,
  Modal,
  Radio,
  RadioGroup,
  Spinner,
  Stepper,
  Switch,
  Tooltip,
  Typography,
  useToast,
  VStack,
} from "asheeui";
import { useEffect, useState } from "react";
import { Panel, ScreenHeading } from "../components";
import type { Workout } from "../data";

/** The detail screen's props: the session and its two ways out. */
export interface WorkoutDetailProps {
  workout: Workout;
  onBack: () => void;
  onFinish: (workoutId: string) => void;
}

/** A single workout. */
export function WorkoutDetailScreen({ workout, onBack, onFinish }: WorkoutDetailProps) {
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [resting, setResting] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [painFree, setPainFree] = useState(true);
  const [rpe, setRpe] = useState("8");

  useEffect(() => {
    if (!resting) return;
    const timer = setTimeout(() => setResting(false), 3000);
    return () => clearTimeout(timer);
  }, [resting]);

  const steps = workout.exercises.map((exercise, index) => ({
    key: exercise.id,
    label: exercise.name,
    description: `Set ${index + 1} of ${workout.exercises.length}`,
  }));

  const current = workout.exercises[Math.min(step, workout.exercises.length - 1)];

  return (
    <VStack gap="xl">
      <Button variant="ghost" size="sm" onPress={onBack}>
        ← Back to the library
      </Button>

      <ScreenHeading
        eyebrow={`${workout.type} · ${workout.durationMinutes} min`}
        title={workout.title}
        description={workout.summary}
        actions={
          <>
            <Tooltip content="Your coach sees the session once it is finished">
              <Badge variant="bordered">{workout.coach}</Badge>
            </Tooltip>
            <Button
              variant="bordered"
              onPress={() => setFinishing(true)}
            >
              Finish session
            </Button>
          </>
        }
      />

      <HStack gap="sm" wrap>
        {workout.equipment.map((item) => (
          <Badge key={item} color="secondary" variant="faded" size="sm">
            {item}
          </Badge>
        ))}
        <Badge
          color={
            workout.intensity === "High"
              ? "danger"
              : workout.intensity === "Moderate"
                ? "warning"
                : "success"
          }
          variant="bordered"
          size="sm"
        >
          {workout.intensity} intensity
        </Badge>
        {workout.completed ? (
          <Badge color="success" variant="faded" size="sm">
            Completed
          </Badge>
        ) : null}
      </HStack>

      <Grid columns={1} columnsLg={3} gap="lg">
        <Panel
          title="Session plan"
          description="Open a movement for the cue the coach wrote."
        >
          <Accordion
            variant="separated"
            defaultValue={current.id}
            items={workout.exercises.map((exercise) => ({
              id: exercise.id,
              title: exercise.name,
              content: (
                <VStack gap="sm">
                  <Typography role="body-sm" tone="muted">
                    {exercise.cue}
                  </Typography>
                  <HStack gap="sm" wrap>
                    <Badge variant="bordered" size="sm">
                      {exercise.sets} × {exercise.reps}
                    </Badge>
                    <Badge variant="bordered" size="sm">
                      {exercise.load}
                    </Badge>
                    <Badge variant="bordered" size="sm">
                      Rest {exercise.rest}
                    </Badge>
                  </HStack>
                </VStack>
              ),
            }))}
          />
        </Panel>

        <VStack gap="lg">
          <Panel
            title="Set log"
            description={`Now: ${current.name} — ${current.sets} × ${current.reps}`}
          >
            <VStack gap="md">
              <Stepper
                steps={steps}
                currentStep={step}
                onStepChange={setStep}
                label="Session progress"
              />
              <Form
                legend="Log the set you just finished"
                submitLabel="Log set"
                onSubmit={() => {
                  toast.success(`${current.name}: set logged`);
                  if (step < workout.exercises.length - 1) setStep(step + 1);
                }}
              >
                <Input label="Load" defaultValue={current.load} />
                <Input label="Reps completed" defaultValue={current.reps} />
                <RadioGroup
                  label="How hard was it?"
                  value={rpe}
                  onChange={setRpe}
                  orientation="horizontal"
                >
                  <Radio value="6" label="6 — easy" />
                  <Radio value="8" label="8 — working" />
                  <Radio value="10" label="10 — limit" />
                </RadioGroup>
                <Switch
                  label="No pain during the set"
                  description="A painful set ends the session, not the programme."
                  checked={painFree}
                  onChange={setPainFree}
                />
              </Form>
              {painFree ? null : (
                <Alert type="warning" title="Stop and tell your coach">
                  Pain is a signal, not a target. End the session and message {workout.coach} from
                  the coach panel.
                </Alert>
              )}
            </VStack>
          </Panel>

          <Panel title="Rest timer" description="Three minutes between heavy sets.">
            <VStack gap="md">
              <HStack justify="between" align="center">
                <Typography role="heading-lg">
                  {resting ? "Resting…" : "Ready"}
                </Typography>
                {resting ? <Spinner /> : <Badge variant="bordered">idle</Badge>}
              </HStack>
              <Button
                variant={resting ? "ghost" : "bordered"}
                onPress={() => setResting(!resting)}
              >
                {resting ? "Stop the timer" : "Start 3-minute rest"}
              </Button>
            </VStack>
          </Panel>
        </VStack>
      </Grid>

      <Modal isOpen={finishing} onClose={() => setFinishing(false)} size="sm">
        <VStack gap="md">
          <Typography role="heading-md">Finish “{workout.title}”?</Typography>
          <Typography role="body-sm" tone="muted">
            The session will be saved with {workout.calories} kcal and its set log. You can edit
            it later from the progress page.
          </Typography>
          <HStack gap="sm" justify="end">
            <Button variant="ghost" onPress={() => setFinishing(false)}>
              Keep training
            </Button>
            <Button
              onPress={() => {
                setFinishing(false);
                toast.success("Session saved");
                onFinish(workout.id);
              }}
            >
              Save session
            </Button>
          </HStack>
        </VStack>
      </Modal>
    </VStack>
  );
}
