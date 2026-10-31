/**
 * The workout library.
 *
 * Three ways to look at the same data — cards for browsing, a searchable data table for
 * comparing, and a shortlist of what is done — which is what exercises `Tabs`,
 * `SearchInput`, `Dropmenu`, `MultiSelect`, `DataTable` and `Pagination` together.
 */
import {
  Badge,
  Button,
  type ColumnDef,
  DataTable,
  Dropmenu,
  EmptyState,
  Grid,
  HStack,
  Modal,
  MultiSelect,
  Pagination,
  SearchInput,
  Tabs,
  Typography,
  useToast,
  VStack,
} from "asheeui";
import { useMemo, useState } from "react";
import { Panel, ScreenHeading, WorkoutCard } from "../components";
import { workoutTypes, workouts, type Workout } from "../data";
import type { ScreenProps } from "../theme";

const INTENSITIES = [
  { label: "Low", value: "Low" },
  { label: "Moderate", value: "Moderate" },
  { label: "High", value: "High" },
];

const COLUMNS: ColumnDef<Workout>[] = [
  { header: "Session", cell: (row) => row.title },
  { header: "Focus", cell: (row) => row.focus },
  { header: "Type", cell: (row) => row.type },
  {
    header: "Intensity",
    cell: (row) => (
      <Badge
        color={
          row.intensity === "High"
            ? "danger"
            : row.intensity === "Moderate"
              ? "warning"
              : "success"
        }
        variant="faded"
        size="sm"
      >
        {row.intensity}
      </Badge>
    ),
  },
  { header: "Minutes", cell: (row) => row.durationMinutes },
  { header: "kcal", cell: (row) => row.calories },
  {
    header: "Coach",
    cell: (row) => row.coach,
  },
];

/** The workout library. */
export function WorkoutsScreen({ onOpenWorkout, onNavigate }: ScreenProps) {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [intensity, setIntensity] = useState<string[]>([]);
  const [planned, setPlanned] = useState<Workout | undefined>();
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return workouts.filter((workout) => {
      if (type !== "all" && workout.type !== type) return false;
      if (intensity.length > 0 && !intensity.includes(workout.intensity)) return false;
      if (!query) return true;
      return (
        workout.title.toLowerCase().includes(query) ||
        workout.focus.toLowerCase().includes(query) ||
        workout.coach.toLowerCase().includes(query)
      );
    });
  }, [search, type, intensity]);

  const pageSize = 4;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const completed = workouts.filter((workout) => workout.completed);

  const library = (
    <VStack gap="lg">
      <Grid columns={1} columnsMd={2} columnsLg={3} gap="md">
        {visible.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} onOpen={onOpenWorkout} />
        ))}
      </Grid>
      {filtered.length === 0 ? (
        <EmptyState
          type="info"
          title="No session matches those filters"
          description="Clear the search or choose another intensity to see the library again."
        />
      ) : null}
      <HStack justify="between" align="center" wrap gap="sm">
        <Typography role="caption" tone="muted">
          {filtered.length} of {workouts.length} sessions
        </Typography>
        <Pagination
          page={page}
          pageCount={pageCount}
          onPageChange={setPage}
          label="Workout pages"
        />
      </HStack>
    </VStack>
  );

  const compare = (
    <VStack gap="md">
      <DataTable
        title="Every session"
        description="Search by name, focus or coach; sort and page in the table."
        data={workouts}
        columns={COLUMNS}
        searchAccessor={(row) => `${row.title} ${row.focus} ${row.coach}`}
      />
      <HStack gap="sm" wrap>
        <Button
          size="sm"
          variant="bordered"
          onPress={() => setPlanned(workouts[0])}
        >
          Add a session to the plan
        </Button>
        <Button size="sm" variant="ghost" onPress={() => onNavigate("progress")}>
          Compare with progress
        </Button>
      </HStack>
    </VStack>
  );

  const done = (
    <VStack gap="md">
      {completed.length > 0 ? (
        <Grid columns={1} columnsMd={2} gap="md">
          {completed.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} onOpen={onOpenWorkout} />
          ))}
        </Grid>
      ) : (
        <EmptyState
          type="success"
          title="Nothing completed yet"
          description="Finish a session and it will appear here with its numbers."
        />
      )}
    </VStack>
  );

  return (
    <VStack gap="xl">
      <ScreenHeading
        eyebrow="Library"
        title="Workouts"
        description="Six sessions across strength, cardio and mobility, from the same programme your coach runs."
        actions={
          <Button variant="bordered" onPress={() => setPlanned(workouts[2])}>
            Add to plan
          </Button>
        }
      />

      <Panel
        title="Find a session"
        description="The filters narrow the library; the tabs change how it is presented."
      >
        <VStack gap="md">
          <Grid columns={1} columnsMd={3} gap="md">
            <VStack gap="xs">
              <Typography role="label">Search</Typography>
              <SearchInput
                label="Search the library"
                description="Name, focus or coach"
                value={search}
                onValueChange={setSearch}
              />
            </VStack>
            <Dropmenu
              label="Type"
              options={workoutTypes}
              value={type}
              onValueChange={(value) => setType(String(value))}
            />
            <VStack gap="xs">
              {/* The two renderers name the multi-select's label differently, so the
                  shared screen states it as typography and leaves the control's own
                  label to the renderer. */}
              <Typography role="label">Intensity</Typography>
              <MultiSelect
                options={INTENSITIES}
                value={intensity}
                onChange={(values) => setIntensity(values.map(String))}
              />
            </VStack>
          </Grid>

          <Tabs
            tabs={[
              { id: "library", label: "Browse", content: library },
              { id: "compare", label: "Compare", content: compare },
              { id: "done", label: `Completed (${completed.length})`, content: done },
            ]}
          />
        </VStack>
      </Panel>

      <Modal
        isOpen={planned !== undefined}
        onClose={() => setPlanned(undefined)}
        size="sm"
      >
        <VStack gap="md">
          <Typography role="heading-md">Add “{planned?.title}” to the plan?</Typography>
          <Typography role="body-sm" tone="muted">
            {planned?.durationMinutes} minutes, {planned?.calories} kcal, coached by{" "}
            {planned?.coach}. It will appear on the next free training day.
          </Typography>
          <HStack gap="sm" justify="end">
            <Button variant="ghost" onPress={() => setPlanned(undefined)}>
              Cancel
            </Button>
            <Button
              onPress={() => {
                toast.success(`${planned?.title} added to the plan`);
                setPlanned(undefined);
              }}
            >
              Add session
            </Button>
          </HStack>
        </VStack>
      </Modal>
    </VStack>
  );
}
