# asheeui

The portable surface of AsheeUI: one import, two renderers. `asheeui` exports the names
`@asheeui/web` and `@asheeui/native` both offer — the intersection, generated from `PORTABLE_API` in
`@asheeui/core` — and the bundler resolves the branch for the platform it is building.

The umbrella offers **183 names**: components, providers, hooks, helpers, constants and types that
behave the same on both platforms. A name only one renderer has is not here; it stays on the
renderer that owns it, so code that imports it fails to compile on the platform that lacks it rather
than finding `undefined` at runtime.

## Install

Install the umbrella and the renderer for the platform you are building:

```bash
# web
pnpm add asheeui @asheeui/web

# React Native / Expo
pnpm add asheeui @asheeui/native
```

The renderers are **optional peers**: `asheeui` itself installs only `@asheeui/core`, so a web app
does not install React Native and an Expo app does not install React DOM. Nothing is decided at
runtime — the manifest's `react-native` field, the `react-native` condition of the exports map and
Metro's `.native` extension are what route an import.

## Use

```tsx
import { AsheeUIProvider, Button, Typography } from "asheeui";
```

Platform extras stay with the renderer that owns them:

```ts
import { Breadcrumb } from "@asheeui/web"; // web-only
import { RowList, TabBar } from "@asheeui/native"; // native-only
```

The section kit is portable too:

```ts
import { ActionGroup, SectionHeading } from "asheeui/section-kit";
```

`SkipLink` is deliberately absent from it: it compensates for a browser's tab order and has no
native counterpart. A web-only application imports it from `@asheeui/web/section-kit`.

## Setup

Four steps are irreducible. Everything else is the framework's.

### 1. The stylesheet (web)

```css
/* app.css */
@import "tailwindcss";
@import "asheeui/styles";
```

`asheeui/styles` is the umbrella's one-line stylesheet; it imports the web renderer's CSS, so an
application does not name `@asheeui/web` anywhere — not even in its CSS.

If the app keeps a shared component directory outside Tailwind's content globs, tell Tailwind to scan
it as well:

```css
@source "../../shared/**/*.tsx";
```

### 2. The Tailwind preset (native)

```js
// tailwind.config.js
const asheeui = require("asheeui/tailwind-preset");

module.exports = {
  presets: [asheeui],
  content: ["./src/**/*.{ts,tsx}", ...asheeui.content],
};
```

The preset is the native renderer's, reached through the umbrella so the app names one package. The
spread is required: Tailwind 3 replaces a preset's `content` with the configuration's own, and the
renderer's compiled classes live in its `dist`, outside the app's directory.

### 3. NativeWind

Babel and Metro keep NativeWind's own configuration; nothing in it changes for the umbrella. See the
NativeWind setup guide for `babel.config.js` and `metro.config.js`.

### 4. The provider

```tsx
import { AsheeUIProvider } from "asheeui";

<AsheeUIProvider config={config}>{children}</AsheeUIProvider>;
```

`config` is the same object on both platforms, typed by the branch's `AsheeConfig`.

## Requirements

| Requirement | Version |
| --- | --- |
| React | 18.2 or newer, or 19 |
| React DOM | the same major as React, for the web renderer |
| React Native | 0.78 or newer, for the native renderer |
| NativeWind | 4.2 or newer, for the native renderer |
| Tailwind CSS | 4.0 or newer on the web, 3.4 or newer on native |

Web and native use different Tailwind majors because the renderers do: the web renderer is Tailwind 4,
the native one NativeWind on Tailwind 3. An application that targets both keeps the two pipelines
separate — that is the parity report's F14, not a wrapper the umbrella can hide.

## What is on the umbrella

The list is `PORTABLE_API` in `@asheeui/core`, and `scripts/check-umbrella.mjs` makes it blocking in
CI. A name is added there only when both renderers publish it under the same name and contract, so a
shared file that compiles against `asheeui` compiles against either branch.

The compatibility matrix (`@asheeui/core/dev`) records what every component means on each platform;
the portable list is the subset both platforms implement. A `web-only`, `native-only` or
`not-applicable` component is never on the umbrella.

## Documentation

- Documentation: https://asheeui.com
- Repository: https://github.com/AsheeSoftworks/AsheeUI
- Issues: https://github.com/AsheeSoftworks/AsheeUI/issues

## License

AsheeUI is licensed under the [Apache License 2.0](../../LICENSE). Copyright and attribution notices
are in the root [NOTICE](../../NOTICE) file.
