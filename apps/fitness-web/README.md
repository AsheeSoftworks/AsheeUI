# Pulse — the web app

The fitness tracker on TanStack Start. It imports the umbrella (`asheeui`) and the shared
screens (`@asheeui/fitness-shared`); it never imports a renderer directly.

## Run

```bash
pnpm --filter @asheeui/fitness-web dev      # http://localhost:5173
pnpm --filter @asheeui/fitness-web build    # SSR + prerendered HTML in dist/
```

`tsr generate` runs before `dev`, `build` and `typecheck`, writing the route tree from
`src/routes`.

## What it demonstrates

- **The umbrella on the web.** One import specifier for components, hooks, types and the
  theme; the bundler resolves `@asheeui/web` from the manifest.
- **The platform difference.** The navigation is a top `Navbar`, sticky and contained; the
  Expo app puts the same destinations in a bottom bar.
- **The stylesheet from the umbrella.** `@import "asheeui/styles"`, not the renderer's.
- **Every screen in the shared kit**: Today, Workouts, a workout detail, Nutrition,
  Progress, Studio and Settings.
- **Puck.** `/studio/edit` is the editor (`@puckeditor/core` with `asheePuckConfig`); the
  published page is stored in `localStorage` and rendered by `PuckPage`. `/studio` is the
  same page as a member sees it — and the same component renders it on a device.
- **Client-side routing through the framework's substitution.** The `Navbar` renders each
  link through TanStack Router's `Link` via the `link` prop.

## Pages

| Route | Screen |
| --- | --- |
| `/` | Today: stats, the week, the next session, streak |
| `/workouts` | The library: search, filters, tabs, table, pagination, modal |
| `/workouts/$workoutId` | A session: plan, set log, timer, finish |
| `/nutrition` | Meals, macros, the plan form |
| `/progress` | Records, calendar, data states |
| `/studio` | The composed Puck page |
| `/studio/edit` | The Puck editor |
| `/settings` | Profile, theme, preferences, destructive and informational layers |
