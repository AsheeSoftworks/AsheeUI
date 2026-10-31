/**
 * Nutrition: the meal log, macros and the week.
 *
 * The screen is the form-heavy half of the app — `Form`, `Input`, `Textarea`, `Dropmenu`,
 * `RadioGroup` and `Switch` — beside the data views a log needs.
 */
import {
  Alert,
  Badge,
  Button,
  type ColumnDef,
  DataTable,
  Dropmenu,
  Form,
  Grid,
  HStack,
  Input,
  Modal,
  Radio,
  RadioGroup,
  Switch,
  Table,
  Tabs,
  Textarea,
  Typography,
  useToast,
  VStack,
} from "asheeui";
import { useState } from "react";
import { Panel, ScreenHeading } from "../components";
import { macros, mealWindows, meals, type Meal } from "../data";
import type { ScreenProps } from "../theme";

/** One macro against its target. */
function MacroCard({
  label,
  value,
  target,
  unit,
}: {
  label: string;
  value: number;
  target: number;
  unit: string;
}) {
  const percent = Math.round((value / target) * 100);
  return (
    <Panel title={label} description={`${value} of ${target} ${unit}`}>
      <HStack justify="between" align="center">
        <Typography role="heading-lg">{percent}%</Typography>
        <Badge
          color={percent >= 95 ? "success" : percent >= 70 ? "primary" : "warning"}
          variant="faded"
          size="sm"
        >
          {percent >= 95 ? "on target" : "to go"}
        </Badge>
      </HStack>
    </Panel>
  );
}

const MEAL_COLUMNS: ColumnDef<Meal>[] = [
  { header: "Meal", cell: (row) => row.name },
  { header: "Time", cell: (row) => row.time },
  { header: "Window", cell: (row) => <Badge variant="bordered" size="sm">{row.tag}</Badge> },
  { header: "kcal", cell: (row) => row.calories },
  { header: "Protein", cell: (row) => `${row.protein} g` },
  { header: "Carbs", cell: (row) => `${row.carbs} g` },
  { header: "Fat", cell: (row) => `${row.fat} g` },
];

/** Nutrition. */
export function NutritionScreen(_props: ScreenProps) {
  const toast = useToast();
  const [log, setLog] = useState<Meal[]>(meals);
  const [name, setName] = useState("");
  const [mealWindow, setMealWindow] = useState("Snack");
  const [calories, setCalories] = useState("250");
  const [notes, setNotes] = useState("");
  const [reminders, setReminders] = useState(true);
  const [pattern, setPattern] = useState("balanced");
  const [water, setWater] = useState<number | undefined>();

  const addMeal = () => {
    if (name.trim().length === 0) {
      toast.warning("Give the meal a name first");
      return;
    }
    setLog((current) => [
      ...current,
      {
        id: `m${current.length + 1}`,
        name: name.trim(),
        time: "now",
        calories: Number(calories) || 0,
        protein: 20,
        carbs: 30,
        fat: 8,
        tag: mealWindow as Meal["tag"],
      },
    ]);
    toast.success(`${name.trim()} logged`);
    setName("");
    setNotes("");
  };

  const today = (
    <VStack gap="lg">
      <Grid columns={1} columnsMd={2} columnsLg={4} gap="md">
        {macros.map((macro) => (
          <MacroCard
            key={macro.key}
            label={macro.label}
            value={macro.value}
            target={macro.target}
            unit={macro.unit}
          />
        ))}
      </Grid>
      <Panel title="Today's meals" description="Everything logged since midnight.">
        <Table data={log} columns={MEAL_COLUMNS} variant="striped" />
      </Panel>
      <Alert type="info" title="Hydration" isClosable>
        Two more glasses reach today's target. Water is the one supplement with no marketing
        budget.
      </Alert>
    </VStack>
  );

  const week = (
    <VStack gap="md">
      <DataTable
        title="The week's log"
        description="Every meal, searchable by name or window."
        data={log}
        columns={MEAL_COLUMNS}
        searchAccessor={(row) => `${row.name} ${row.tag}`}
      />
    </VStack>
  );

  const plan = (
    <Grid columns={1} columnsLg={2} gap="lg">
      <Panel title="Meal pattern" description="The shape the week is built around.">
        <RadioGroup
          label="Pattern"
          value={pattern}
          onChange={setPattern}
          orientation="vertical"
        >
          <Radio value="balanced" label="Balanced" description="Three meals and two snacks" />
          <Radio value="early" label="Early window" description="All meals before 18:00" />
          <Radio value="training" label="Training days" description="More carbohydrate around sessions" />
        </RadioGroup>
      </Panel>
      <Panel title="Reminders" description="The small nudges that keep the log honest.">
        <VStack gap="md">
          <Switch
            label="Meal reminders"
            description="A notification ten minutes before each window."
            checked={reminders}
            onChange={setReminders}
          />
          <Switch label="Weekly summary" description="Sunday evening, by email." />
          <Button
            variant="bordered"
            onPress={() => {
              toast.success("Nutrition plan shared with Coach Ade");
            }}
          >
            Share the plan with your coach
          </Button>
        </VStack>
      </Panel>
    </Grid>
  );

  return (
    <VStack gap="xl">
      <ScreenHeading
        eyebrow="Fuel"
        title="Nutrition"
        description={`${log.length} meals logged today. The targets are set from your training load, not a generic calculator.`}
        actions={
          <Button variant="bordered" onPress={() => setWater(0)}>
            Log water
          </Button>
        }
      />

      <Panel
        title="Add a meal"
        description="The form is the same on both platforms; only the keyboard differs."
      >
        <Form legend="A meal you just ate" submitLabel="Log meal" onSubmit={addMeal}>
          <Input
            label="What did you eat?"
            placeholder="Chicken, rice and greens"
            value={name}
            onChangeText={setName}
          />
          <Grid columns={1} columnsMd={2} gap="md">
            <Dropmenu
              label="Window"
              options={mealWindows}
              value={mealWindow}
              onValueChange={(value) => setMealWindow(String(value))}
            />
            <Input
              label="Calories"
              value={calories}
              onChangeText={setCalories}
            />
          </Grid>
          <Textarea
            label="Notes"
            description="Anything the coach should know about this meal."
            placeholder="Felt good, portion was large…"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </Form>
      </Panel>

      <Tabs
        tabs={[
          { id: "today", label: "Today", content: today },
          { id: "week", label: "This week", content: week },
          { id: "plan", label: "Plan", content: plan },
        ]}
      />

      <Modal isOpen={water !== undefined} onClose={() => setWater(undefined)} size="sm">
        <VStack gap="md">
          <Typography role="heading-md">Log water</Typography>
          <Typography role="body-sm" tone="muted">
            How much did you drink? The target is eight glasses, and the log is per glass.
          </Typography>
          <HStack gap="sm" wrap>
            {[150, 250, 500].map((amount) => (
              <Button
                key={amount}
                variant="bordered"
                onPress={() => {
                  setWater((water ?? 0) + amount);
                  toast.success(`${amount} ml logged`);
                  setWater(undefined);
                }}
              >
                {amount} ml
              </Button>
            ))}
          </HStack>
        </VStack>
      </Modal>
    </VStack>
  );
}
