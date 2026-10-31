/**
 * Progress: records, the calendar and the states a data screen can be in.
 *
 * `Calendar`, `Table`, `Tabs`, `Marquee`, the three state components and a `Tooltip`
 * together cover the reflection half of the app.
 */
import {
  Alert,
  Badge,
  Button,
  Calendar,
  type ColumnDef,
  EmptyState,
  ErrorState,
  Grid,
  HStack,
  LoadingState,
  Marquee,
  Skeleton,
  Table,
  Tabs,
  Tooltip,
  Typography,
  VStack,
} from "asheeui";
import { useState } from "react";
import { Panel, ScreenHeading } from "../components";
import { achievements, records, week, type DayActivity, type PersonalRecord } from "../data";
import type { ScreenProps } from "../theme";

const RECORD_COLUMNS: ColumnDef<PersonalRecord>[] = [
  { header: "Movement", cell: (row) => row.lift },
  { header: "Now", cell: (row) => row.value },
  { header: "Before", cell: (row) => row.previous },
  {
    header: "Change",
    cell: (row) => (
      <Badge
        color={row.change.startsWith("-") ? "success" : "primary"}
        variant="faded"
        size="sm"
      >
        {row.change}
      </Badge>
    ),
  },
  { header: "Set on", cell: (row) => row.date },
];

const DAY_COLUMNS: ColumnDef<DayActivity>[] = [
  { header: "Day", cell: (row) => row.day },
  { header: "Steps", cell: (row) => row.steps.toLocaleString("en-US") },
  { header: "Active", cell: (row) => `${row.activeMinutes} min` },
];

/** Progress. */
export function ProgressScreen({ onNavigate }: ScreenProps) {
  const [date, setDate] = useState<Date | undefined>();
  const selected = date
    ? week.find((day) => day.date === `${date.getDate()} Apr`)
    : undefined;

  const overview = (
    <VStack gap="lg">
      <Grid columns={1} columnsMd={3} gap="md">
        {achievements.map((achievement) => (
          <Panel key={achievement.id} title={achievement.title} description={achievement.detail}>
            <HStack justify="between" align="center">
              <Typography role="heading-lg">{achievement.title.split(" ")[0]}</Typography>
              <Badge color={achievement.tone} variant="bordered" size="sm">
                milestone
              </Badge>
            </HStack>
          </Panel>
        ))}
      </Grid>

      <Marquee speed="slow" fadeEdges>
        {records.map((record) => (
          <Badge key={record.lift} color="secondary" variant="bordered">
            {record.lift}: {record.value}
          </Badge>
        ))}
      </Marquee>

      <Panel
        title="This week"
        description="The days that got you here."
        action={
          <Button size="sm" variant="ghost" onPress={() => onNavigate("workouts")}>
            Train again
          </Button>
        }
      >
        <Table data={week} columns={DAY_COLUMNS} variant="striped" />
      </Panel>
    </VStack>
  );

  const recordList = (
    <Panel
      title="Personal records"
      description="Every record is a session that worked; the previous number is the one it beat."
    >
      <VStack gap="md">
        <Table data={records} columns={RECORD_COLUMNS} variant="striped" />
        <Tooltip content="Records are recalculated from the set log, not entered by hand">
          <Badge color="primary" variant="faded" size="sm">
            verified from session data
          </Badge>
        </Tooltip>
      </VStack>
    </Panel>
  );

  const calendar = (
    <Grid columns={1} columnsLg={2} gap="lg">
      <Panel title="Training calendar" description="The current training block.">
        <Calendar
          label="Pick a day"
          onChange={(next) => setDate(next ?? undefined)}
          isClearable
        />
      </Panel>
      <VStack gap="md">
        <Panel
          title="The selected day"
          description="What the block held, and what it cost."
        >
          {selected ? (
            <VStack gap="sm">
              <Typography role="heading-lg">{selected.day}</Typography>
              <Typography role="body-sm" tone="muted">
                {selected.date} — {selected.steps.toLocaleString("en-US")} steps,{" "}
                {selected.activeMinutes} active minutes and {selected.calories} kcal.
              </Typography>
              <HStack gap="sm" wrap>
                <Badge color="primary" variant="faded" size="sm">
                  {selected.activeMinutes >= 60 ? "on target" : "short of target"}
                </Badge>
                <Button
                  size="sm"
                  variant="bordered"
                  onPress={() => onNavigate("workouts")}
                >
                  Repeat the day
                </Button>
              </HStack>
            </VStack>
          ) : (
            <EmptyState
              type="info"
              title="Pick a day"
              description="The calendar shows what the block held on the day you choose."
            />
          )}
        </Panel>
        <Alert type="success" title="Consistency beats intensity">
          Four weeks of three sessions is worth more than one perfect week. The block keeps the
          same shape on purpose.
        </Alert>
      </VStack>
    </Grid>
  );

  const states = (
    <Grid columns={1} columnsMd={2} gap="md">
      <Panel title="Loading" description="A placeholder while the block is fetched.">
        <VStack gap="sm">
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <LoadingState label="Reading the block" />
        </VStack>
      </Panel>
      <Panel title="Empty" description="A list with nothing in it.">
        <EmptyState
          type="info"
          title="No sessions this month"
          description="A rest month is a decision, not a failure. Add a block when you are ready."
        />
      </Panel>
      <Panel title="Failed" description="A request that did not answer.">
        <ErrorState
          title="The block could not be read"
          description="The service did not answer in time. The last saved block is still shown."
        />
      </Panel>
      <Panel title="Fine" description="The state the page usually is.">
        <VStack gap="sm">
          <Typography role="heading-sm">All sessions loaded</Typography>
          <Typography role="body-sm" tone="muted">
            The state components are part of the same vocabulary as the data ones: a screen
            picks one, and the page never shows nothing.
          </Typography>
        </VStack>
      </Panel>
    </Grid>
  );

  return (
    <VStack gap="xl">
      <ScreenHeading
        eyebrow="The long game"
        title="Progress"
        description="Records, the training block and the states a data screen can be in."
        actions={
          <Button variant="bordered" onPress={() => onNavigate("studio")}>
            Build a report
          </Button>
        }
      />
      <Tabs
        tabs={[
          { id: "overview", label: "Overview", content: overview },
          { id: "records", label: "Records", content: recordList },
          { id: "calendar", label: "Calendar", content: calendar },
          { id: "states", label: "Data states", content: states },
        ]}
      />
    </VStack>
  );
}
