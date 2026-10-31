/**
 * Today: the dashboard.
 *
 * The screen answers the three questions a training app opens with — how am I doing,
 * what is next, and how is the week going — with the framework's stat, card, table and
 * marketing pieces. Every interaction is `onPress`, so it is the same component tree in a
 * browser and on a device.
 */
import {
  Alert,
  Badge,
  Button,
  type ColumnDef,
  Grid,
  HStack,
  Marquee,
  Table,
  Tooltip,
  Typography,
  VStack,
} from "asheeui";
import { useState } from "react";
import { Panel, ScreenHeading, StatGrid, WorkoutCard } from "../components";
import { achievements, profile, today, week, workouts, type DayActivity } from "../data";
import type { ScreenProps } from "../theme";

const WEEK_COLUMNS: ColumnDef<DayActivity>[] = [
  { header: "Day", cell: (row) => row.day },
  { header: "Date", cell: (row) => row.date },
  { header: "Steps", cell: (row) => row.steps.toLocaleString("en-US") },
  { header: "Active", cell: (row) => `${row.activeMinutes} min` },
  {
    header: "Calories",
    cell: (row) => `${row.calories.toLocaleString("en-US")} kcal`,
  },
];

/** The training week so far, as a table with a compact footer. */
function WeekTable() {
  const totalMinutes = week.reduce((sum, day) => sum + day.activeMinutes, 0);
  const totalSteps = week.reduce((sum, day) => sum + day.steps, 0);

  return (
    <VStack gap="sm">
      <Table data={week} columns={WEEK_COLUMNS} variant="striped" />
      <HStack justify="between" wrap gap="sm">
        <Typography role="caption" tone="muted">
          {totalSteps.toLocaleString("en-US")} steps this week
        </Typography>
        <Badge
          color={totalMinutes >= profile.weeklyGoalMinutes ? "success" : "warning"}
          variant="faded"
          size="sm"
        >
          {totalMinutes} / {profile.weeklyGoalMinutes} active minutes
        </Badge>
      </HStack>
    </VStack>
  );
}

/** The dashboard. */
export function DashboardScreen({ onNavigate, onOpenWorkout }: ScreenProps) {
  const nextWorkout = workouts.find((workout) => !workout.completed) ?? workouts[0];
  const [dismissed, setDismissed] = useState(false);

  return (
    <VStack gap="xl">
      <ScreenHeading
        eyebrow={`Good morning, ${profile.firstName}`}
        title="Today"
        description={`Day ${profile.streakDays} of your streak. One session and a walk would keep it alive.`}
        actions={
          <>
            <Tooltip content="A session starts from the workout library">
              <Button variant="bordered" onPress={() => onNavigate("workouts")}>
                Browse sessions
              </Button>
            </Tooltip>
            <Button onPress={() => onOpenWorkout(nextWorkout.id)}>
              Start {nextWorkout.title.toLowerCase()}
            </Button>
          </>
        }
      />

      <StatGrid metrics={today} />

      <Marquee speed="slow" fadeEdges>
        {[
          <Badge key="a" color="primary" variant="bordered">
            {profile.streakDays}-day streak
          </Badge>,
          <Badge key="b" color="success" variant="bordered">
            Resting HR {profile.restingHeartRate} bpm
          </Badge>,
          <Badge key="c" color="secondary" variant="bordered">
            {profile.plan} plan
          </Badge>,
          <Badge key="d" color="warning" variant="bordered">
            Coach: {profile.coach}
          </Badge>,
        ]}
      </Marquee>

      <Panel
        title="This week"
        description="Steps and active minutes, day by day."
        action={
          <Button size="sm" variant="ghost" onPress={() => onNavigate("progress")}>
            See progress
          </Button>
        }
      >
        <WeekTable />
      </Panel>

      <Grid columns={1} columnsMd={2} gap="lg">
        <Panel
          title="Next session"
          description="The next block in the programme."
          action={
            <Button size="sm" variant="ghost" onPress={() => onNavigate("workouts")}>
              Library
            </Button>
          }
        >
          <WorkoutCard workout={nextWorkout} onOpen={onOpenWorkout} />
        </Panel>

        <Panel title="Streak" description="What consistency has bought so far.">
          <VStack gap="md">
            <HStack justify="between" align="center">
              <Typography role="heading-xl">{profile.streakDays}</Typography>
              <Badge color="success" variant="faded">
                days
              </Badge>
            </HStack>
            <VStack gap="sm">
              {achievements.map((achievement) => (
                <HStack key={achievement.id} justify="between" align="center" gap="sm">
                  <VStack gap="xs">
                    <Typography role="label">{achievement.title}</Typography>
                    <Typography role="caption" tone="muted">
                      {achievement.detail}
                    </Typography>
                  </VStack>
                  <Badge color={achievement.tone} variant="bordered" size="sm">
                    earned
                  </Badge>
                </HStack>
              ))}
            </VStack>
            <Button size="sm" variant="bordered" onPress={() => onNavigate("studio")}>
              Compose your own view
            </Button>
          </VStack>
        </Panel>
      </Grid>

      {dismissed ? null : (
        <Alert
          type="info"
          title="Recovery is part of the plan"
          isClosable
          onClose={() => setDismissed(true)}
        >
          Sleep and hydration move the needle as much as the session does. Tonight's target is
          eight hours and two more glasses of water.
        </Alert>
      )}
    </VStack>
  );
}
