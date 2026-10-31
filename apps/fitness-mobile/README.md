# Pulse — the Expo app

The fitness tracker on Expo. It imports the umbrella (`asheeui`) and the shared screens
(`@asheeui/fitness-shared`); it never imports a renderer directly. Expo, React Native and
NativeWind are the platform shell.

## Run

```bash
pnpm --filter @asheeui/fitness-mobile start       # Expo dev server
pnpm --filter @asheeui/fitness-mobile ios         # a simulator
pnpm --filter @asheeui/fitness-mobile android
pnpm --filter @asheeui/fitness-mobile build       # expo export --platform ios
```

## What it demonstrates

- **The umbrella on a device.** The same `asheeui` import specifiers resolve to
  `@asheeui/native` through the `react-native` condition, and no DOM code reaches the
  bundle.
- **The platform difference.** The destinations live in a bottom bar, and the settings
  entry is in the header; the web app uses a top `Navbar`. The screens are identical.
- **NativeWind from the umbrella's preset.** `asheeui/tailwind-preset` in
  `tailwind.config.js`, with the shared kit in `content`.
- **The same Puck document.** `PuckPage` renders the studio page with the native renderer;
  the web app's editor published the same blocks.
- **Every shared screen**, including the field family, the table and the overlays.

## Metro and the workspace

`metro.config.js` watches the workspace root, adds both `node_modules` directories and
enables package `exports` (so the `react-native` condition applies). Hierarchical lookup
stays on: pnpm puts a package's own dependencies beside its real path in the virtual
store.
