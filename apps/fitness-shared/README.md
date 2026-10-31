# @asheeui/fitness-shared

The screens, data and configuration both Pulse apps render.

**The rule:** every file here imports from `asheeui` (and `@asheeui/puck` for the studio
page) and nothing else from the framework. No `@asheeui/web`, no `@asheeui/native`, no
`div`, no `View`, no `className`. That is what makes the same source compile against the
web branch in TanStack Start and the native branch in Expo.

| File | What it holds |
| --- | --- |
| `src/data.ts` | The fixture: profile, week, workouts, meals, records |
| `src/theme.ts` | `ExternalConfig` for the provider, destinations, screen props |
| `src/components.tsx` | `ScreenHeading`, `StatGrid`, `Panel`, `WorkoutCard` |
| `src/screens/*` | The seven screens |

The screens take `onNavigate` and `onOpenWorkout` callbacks; the shells own the router.
