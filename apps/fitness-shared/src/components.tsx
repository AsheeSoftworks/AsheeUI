/**
 * The presentation pieces the screens share.
 *
 * Every component here is on `PORTABLE_API` and every interaction is `onPress` or a
 * portable change prop, so the same file renders in TanStack Start and in Expo. There is
 * no `className`, no `div`, no `View`: the layout vocabulary is the framework's.
 */
import {
  Avatar,
  Badge,
  Button,
  Card,
  Grid,
  HStack,
  Typography,
  VStack,
  type Color,
} from "asheeui";
import type { ReactNode } from "react";
import type { Metric, Workout } from "./data";

/** Hero strip at the top of every screen: eyebrow, title, description and actions. */
export function ScreenHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <HStack justify="between" align="end" gap="md" wrap>
      <VStack gap="xs">
        <Typography role="overline" tone="primary">
          {eyebrow.toUpperCase()}
        </Typography>
        <Typography role="page-title">{title}</Typography>
        <Typography role="body-md" tone="muted">
          {description}
        </Typography>
      </VStack>
      {actions ? (
        <HStack gap="sm" wrap align="center">
          {actions}
        </HStack>
      ) : null}
    </HStack>
  );
}

/** One headline number with its goal and trend. */
export function StatCard({ metric }: { metric: Metric }) {
  return (
    <Card variant="bordered" size="md">
      <VStack gap="sm">
        <HStack justify="between" align="center">
          <Typography role="label" tone="muted">
            {metric.label}
          </Typography>
          <Badge color={metric.tone} variant="faded" size="sm">
            {metric.percent}%
          </Badge>
        </HStack>
        <Typography role="heading-xl">{metric.value}</Typography>
        <Typography role="caption" tone="muted">
          of {metric.goal}
        </Typography>
        <Typography role="caption" tone={metric.percent >= 85 ? "success" : "muted"}>
          {metric.trend}
        </Typography>
      </VStack>
    </Card>
  );
}

/** The four headline numbers as a responsive grid. */
export function StatGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <Grid columns={1} columnsMd={2} columnsLg={4} gap="md">
      {metrics.map((metric) => (
        <StatCard key={metric.key} metric={metric} />
      ))}
    </Grid>
  );
}

/** A titled panel, the container most of a screen uses. */
export function Panel({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card variant="bordered" size="lg">
      <VStack gap="md">
        <HStack justify="between" align="start" gap="md" wrap>
          <VStack gap="xs">
            <Typography role="heading-sm">{title}</Typography>
            {description ? (
              <Typography role="body-sm" tone="muted">
                {description}
              </Typography>
            ) : null}
          </VStack>
          {action}
        </HStack>
        {children}
      </VStack>
    </Card>
  );
}

/** A workout in the library: identity, numbers and the way in. */
export function WorkoutCard({
  workout,
  onOpen,
}: {
  workout: Workout;
  onOpen: (id: string) => void;
}) {
  return (
    <Card variant="bordered" size="md">
      <VStack gap="sm">
        <HStack justify="between" align="start" gap="sm">
          <HStack gap="sm" align="center">
            <Avatar name={workout.title} size="sm" />
            <VStack gap="xs">
              <Typography role="heading-sm">{workout.title}</Typography>
              <Typography role="caption" tone="muted">
                {workout.focus}
              </Typography>
            </VStack>
          </HStack>
          <Badge
            color={
              workout.intensity === "High"
                ? "danger"
                : workout.intensity === "Moderate"
                  ? "warning"
                  : "success"
            }
            variant="faded"
            size="sm"
          >
            {workout.intensity}
          </Badge>
        </HStack>

        <Typography role="body-sm" tone="muted">
          {workout.summary}
        </Typography>

        <HStack gap="sm" wrap>
          <Badge variant="bordered" size="sm">
            {workout.durationMinutes} min
          </Badge>
          <Badge variant="bordered" size="sm">
            {workout.calories} kcal
          </Badge>
          <Badge variant="bordered" size="sm">
            {workout.type}
          </Badge>
          {workout.completed ? (
            <Badge color="success" variant="faded" size="sm">
              Done
            </Badge>
          ) : null}
        </HStack>

        <HStack gap="sm" wrap>
          <Button size="sm" variant="solid" onPress={() => onOpen(workout.id)}>
            {workout.completed ? "Review session" : "Start session"}
          </Button>
          <Button size="sm" variant="ghost" onPress={() => onOpen(workout.id)}>
            Details
          </Button>
        </HStack>
      </VStack>
    </Card>
  );
}

/** A colour role, named once so the screens agree what a tone means. */
export function toneColor(tone: "primary" | "success" | "warning" | "secondary"): Color {
  return tone;
}
