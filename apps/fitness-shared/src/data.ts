/**
 * The fitness tracker's data, shared by both demo applications.
 *
 * This is a fixture, not a data layer: the point of the two apps is the framework surface,
 * so the numbers are stable and the screens read them synchronously. A production app would
 * fetch them through a query library; nothing here would change at the component level.
 */

/** The person the dashboard greets. */
export const profile = {
  name: "Maya Okafor",
  firstName: "Maya",
  initials: "MO",
  plan: "Performance",
  streakDays: 12,
  memberSince: "March 2024",
  coach: "Coach Ade",
  restingHeartRate: 58,
  weeklyGoalMinutes: 240,
} as const;

/** One day of the current week. */
export interface DayActivity {
  day: string;
  date: string;
  steps: number;
  calories: number;
  activeMinutes: number;
}

/** The current week, oldest first. */
export const week: DayActivity[] = [
  { day: "Mon", date: "14 Apr", steps: 9120, calories: 2280, activeMinutes: 62 },
  { day: "Tue", date: "15 Apr", steps: 6480, calories: 1940, activeMinutes: 41 },
  { day: "Wed", date: "16 Apr", steps: 11240, calories: 2460, activeMinutes: 78 },
  { day: "Thu", date: "17 Apr", steps: 7890, calories: 2110, activeMinutes: 52 },
  { day: "Fri", date: "18 Apr", steps: 10460, calories: 2380, activeMinutes: 69 },
  { day: "Sat", date: "19 Apr", steps: 4380, calories: 1720, activeMinutes: 24 },
  { day: "Sun", date: "20 Apr", steps: 8432, calories: 2140, activeMinutes: 54 },
];

/** Today's headline numbers, each with the goal it is measured against. */
export interface Metric {
  key: string;
  label: string;
  value: string;
  goal: string;
  /** Progress toward the goal, 0–100. */
  percent: number;
  trend: string;
  tone: "primary" | "success" | "warning" | "secondary";
}

export const today: Metric[] = [
  {
    key: "steps",
    label: "Steps",
    value: "8,432",
    goal: "10,000",
    percent: 84,
    trend: "+12% vs last week",
    tone: "primary",
  },
  {
    key: "calories",
    label: "Calories",
    value: "2,140",
    goal: "2,600 kcal",
    percent: 82,
    trend: "-3% vs last week",
    tone: "success",
  },
  {
    key: "active",
    label: "Active minutes",
    value: "54",
    goal: "60 min",
    percent: 90,
    trend: "+8 min this week",
    tone: "warning",
  },
  {
    key: "sleep",
    label: "Sleep",
    value: "7h 24m",
    goal: "8 hours",
    percent: 92,
    trend: "Deep sleep 1h 51m",
    tone: "secondary",
  },
];

/** A workout in the library. */
export interface Workout {
  id: string;
  title: string;
  focus: string;
  type: "Strength" | "Cardio" | "Mobility" | "Recovery";
  durationMinutes: number;
  intensity: "Low" | "Moderate" | "High";
  calories: number;
  coach: string;
  equipment: string[];
  summary: string;
  completed: boolean;
  exercises: Exercise[];
}

/** One movement in a workout. */
export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  load: string;
  rest: string;
  cue: string;
}

export const workouts: Workout[] = [
  {
    id: "lower-power",
    title: "Lower body power",
    focus: "Quads, glutes, hamstrings",
    type: "Strength",
    durationMinutes: 48,
    intensity: "High",
    calories: 430,
    coach: "Coach Ade",
    equipment: ["Barbell", "Bench", "Bands"],
    summary:
      "A heavy tri-set that opens with a hinge, builds through a squat and finishes with a unilateral burner.",
    completed: true,
    exercises: [
      {
        id: "deadlift",
        name: "Trap-bar deadlift",
        sets: 4,
        reps: "5",
        load: "90 kg",
        rest: "2 min",
        cue: "Brace before the bar moves; push the floor away.",
      },
      {
        id: "split-squat",
        name: "Bulgarian split squat",
        sets: 3,
        reps: "8 / side",
        load: "2 × 12 kg",
        rest: "90 s",
        cue: "Front shin vertical, back knee soft.",
      },
      {
        id: "hip-thrust",
        name: "Hip thrust",
        sets: 3,
        reps: "10",
        load: "60 kg",
        rest: "75 s",
        cue: "Ribs down, squeeze at the top for a full second.",
      },
      {
        id: "sled",
        name: "Sled push",
        sets: 6,
        reps: "20 m",
        load: "40 kg",
        rest: "60 s",
        cue: "Short steps, long arms, no rest at the turn.",
      },
    ],
  },
  {
    id: "tempo-run",
    title: "Tempo run",
    focus: "Aerobic threshold",
    type: "Cardio",
    durationMinutes: 36,
    intensity: "Moderate",
    calories: 360,
    coach: "Coach Ines",
    equipment: ["Treadmill or road"],
    summary:
      "Ten minutes easy, three blocks at a controlled threshold, then a cooldown that keeps the legs moving.",
    completed: true,
    exercises: [
      {
        id: "warmup",
        name: "Easy jog",
        sets: 1,
        reps: "10 min",
        load: "Zone 2",
        rest: "—",
        cue: "Nose-breathing pace; you can hold a conversation.",
      },
      {
        id: "tempo-1",
        name: "Threshold block",
        sets: 3,
        reps: "6 min",
        load: "Zone 4",
        rest: "2 min walk",
        cue: "Even effort, not even pace. Relax the shoulders.",
      },
      {
        id: "cooldown",
        name: "Cooldown walk",
        sets: 1,
        reps: "6 min",
        load: "Zone 1",
        rest: "—",
        cue: "Let the heart rate fall before you stop moving.",
      },
    ],
  },
  {
    id: "push-volume",
    title: "Push volume",
    focus: "Chest, shoulders, triceps",
    type: "Strength",
    durationMinutes: 42,
    intensity: "Moderate",
    calories: 340,
    coach: "Coach Ade",
    equipment: ["Dumbbells", "Bench"],
    summary:
      "A horizontal press, a vertical press and two shoulder finishers, with the last set taken close to failure.",
    completed: false,
    exercises: [
      {
        id: "bench",
        name: "Dumbbell bench press",
        sets: 4,
        reps: "10",
        load: "2 × 24 kg",
        rest: "90 s",
        cue: "Elbows at forty-five degrees, wrists stacked.",
      },
      {
        id: "ohp",
        name: "Seated shoulder press",
        sets: 3,
        reps: "10",
        load: "2 × 16 kg",
        rest: "75 s",
        cue: "Press slightly forward of the ears, ribs down.",
      },
      {
        id: "lateral",
        name: "Lateral raise",
        sets: 3,
        reps: "15",
        load: "2 × 7 kg",
        rest: "45 s",
        cue: "Lead with the elbow, stop at shoulder height.",
      },
      {
        id: "pushdown",
        name: "Rope pushdown",
        sets: 3,
        reps: "12",
        load: "25 kg",
        rest: "45 s",
        cue: "Upper arms pinned; spread the rope at the bottom.",
      },
    ],
  },
  {
    id: "mobility-reset",
    title: "Mobility reset",
    focus: "Hips, thoracic spine, ankles",
    type: "Mobility",
    durationMinutes: 24,
    intensity: "Low",
    calories: 110,
    coach: "Coach Ines",
    equipment: ["Mat", "Band"],
    summary:
      "A short evening flow that buys the next training day: hips first, then the spine, then the ankles.",
    completed: false,
    exercises: [
      {
        id: "90-90",
        name: "90/90 hip switch",
        sets: 2,
        reps: "8 / side",
        load: "Bodyweight",
        rest: "30 s",
        cue: "Move from the hip, not the lower back.",
      },
      {
        id: "tspine",
        name: "Thoracic open book",
        sets: 2,
        reps: "10 / side",
        load: "Bodyweight",
        rest: "30 s",
        cue: "Exhale as the chest turns; keep the knees stacked.",
      },
      {
        id: "ankle",
        name: "Knee-to-wall ankle rock",
        sets: 2,
        reps: "12 / side",
        load: "Band",
        rest: "30 s",
        cue: "Heel stays down; aim the knee over the second toe.",
      },
    ],
  },
  {
    id: "conditioning-circuit",
    title: "Conditioning circuit",
    focus: "Full body, heart rate",
    type: "Cardio",
    durationMinutes: 32,
    intensity: "High",
    calories: 410,
    coach: "Coach Ade",
    equipment: ["Kettlebell", "Rower", "Box"],
    summary:
      "Four rounds of a carry, a row and a step-up, paced so the last round is as fast as the first.",
    completed: false,
    exercises: [
      {
        id: "carry",
        name: "Farmer carry",
        sets: 4,
        reps: "40 m",
        load: "2 × 28 kg",
        rest: "60 s",
        cue: "Tall posture, no leaning. Grip is the limiter.",
      },
      {
        id: "row",
        name: "Row",
        sets: 4,
        reps: "250 m",
        load: "—",
        rest: "60 s",
        cue: "Legs, body, arms; reverse on the way back.",
      },
      {
        id: "stepup",
        name: "Box step-up",
        sets: 4,
        reps: "10 / side",
        load: "2 × 10 kg",
        rest: "60 s",
        cue: "Drive through the whole foot, control the descent.",
      },
    ],
  },
  {
    id: "long-ride",
    title: "Long ride",
    focus: "Endurance",
    type: "Cardio",
    durationMinutes: 75,
    intensity: "Moderate",
    calories: 620,
    coach: "Coach Ines",
    equipment: ["Bike", "Heart-rate strap"],
    summary:
      "Seventy-five minutes of steady riding with three short surges, which is the session the week is built around.",
    completed: false,
    exercises: [
      {
        id: "endurance",
        name: "Steady ride",
        sets: 1,
        reps: "60 min",
        load: "Zone 2",
        rest: "—",
        cue: "Cadence 85–95; eat every twenty minutes.",
      },
      {
        id: "surges",
        name: "Surges",
        sets: 3,
        reps: "1 min",
        load: "Zone 5",
        rest: "4 min easy",
        cue: "Stand, accelerate, sit, settle. No sprinting.",
      },
      {
        id: "spin",
        name: "Spin down",
        sets: 1,
        reps: "10 min",
        load: "Zone 1",
        rest: "—",
        cue: "Light gear, high cadence, let the legs empty.",
      },
    ],
  },
];

/** A meal in today's log. */
export interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tag: "Breakfast" | "Lunch" | "Dinner" | "Snack";
}

export const meals: Meal[] = [
  { id: "m1", name: "Greek yoghurt, berries, almonds", time: "07:10", calories: 380, protein: 24, carbs: 41, fat: 14, tag: "Breakfast" },
  { id: "m2", name: "Chicken, rice and roasted vegetables", time: "12:40", calories: 640, protein: 48, carbs: 72, fat: 18, tag: "Lunch" },
  { id: "m3", name: "Protein shake and a banana", time: "16:05", calories: 310, protein: 31, carbs: 38, fat: 5, tag: "Snack" },
  { id: "m4", name: "Salmon, potatoes, greens", time: "19:20", calories: 710, protein: 44, carbs: 58, fat: 31, tag: "Dinner" },
  { id: "m5", name: "Cottage cheese and honey", time: "21:30", calories: 210, protein: 22, carbs: 18, fat: 6, tag: "Snack" },
];

/** Today's macro totals, and the targets they count toward. */
export const macros = [
  { key: "calories", label: "Calories", value: 2250, target: 2600, unit: "kcal" },
  { key: "protein", label: "Protein", value: 169, target: 180, unit: "g" },
  { key: "carbs", label: "Carbs", value: 227, target: 300, unit: "g" },
  { key: "fat", label: "Fat", value: 74, target: 80, unit: "g" },
];

/** A personal record the progress page celebrates. */
export interface PersonalRecord {
  lift: string;
  value: string;
  previous: string;
  date: string;
  change: string;
}

export const records: PersonalRecord[] = [
  { lift: "Trap-bar deadlift", value: "142.5 kg", previous: "137.5 kg", date: "12 Apr", change: "+5 kg" },
  { lift: "Back squat", value: "112.5 kg", previous: "110 kg", date: "05 Apr", change: "+2.5 kg" },
  { lift: "Bench press", value: "82.5 kg", previous: "80 kg", date: "29 Mar", change: "+2.5 kg" },
  { lift: "5 km run", value: "22:41", previous: "23:18", date: "21 Mar", change: "-37 s" },
  { lift: "Rowing 2 km", value: "7:24", previous: "7:31", date: "16 Mar", change: "-7 s" },
];

/** Achievements shown on the progress page. */
export const achievements = [
  { id: "streak", title: "12-day streak", detail: "Train or walk every day", tone: "success" as const },
  { id: "volume", title: "40 t lifted", detail: "Since January", tone: "primary" as const },
  { id: "consistency", title: "4 weeks on plan", detail: "Three sessions a week", tone: "secondary" as const },
];

/** The options the workout filters offer. */
export const workoutTypes = [
  { label: "All sessions", value: "all" },
  { label: "Strength", value: "Strength" },
  { label: "Cardio", value: "Cardio" },
  { label: "Mobility", value: "Mobility" },
  { label: "Recovery", value: "Recovery" },
];

/** Delivery windows offered by the nutrition planner. */
export const mealWindows = [
  { label: "Breakfast", value: "Breakfast" },
  { label: "Lunch", value: "Lunch" },
  { label: "Dinner", value: "Dinner" },
  { label: "Snack", value: "Snack" },
];
