# @asheeui/native

AsheeUI on React Native: the same component vocabulary, the same prop contracts and
the same design language as the web renderer, built from the platform's own
components so a screen behaves the way the platform behaves. Styling is NativeWind,
and the layer both renderers share is `@asheeui/core`.

## Features

- **The whole component set** — every one of the 58 components the compatibility
  matrix promises for native is implemented: the layout kit, the field family, the
  feedback and state family, the navigation, the overlays, the page shell and the
  marketing bands.
- **One vocabulary across platforms** — a component is imported by the same name
  and takes the same props as its web counterpart, so a screen and a page can share
  their composition.
- **A layout kit and responsiveness** — `Container`, `Stack`/`HStack`/`VStack`,
  `Grid`, `Section`, `Split` and `Page` with its header, content and footer, plus
  `useBreakpoint` with the pure `resolveBreakpoint` and `resolveGridColumns`.
- **Config-driven** — every component registers its defaults and resolves them
  through the same cascade the renderer reads, so a value can be set globally, per
  component or per instance.
- **The platform's accessibility** — roles and state are stated in the platform's
  own vocabulary, and each component's tests assert them.
- **TypeScript-first** — fully typed props with JSDoc on every exported symbol.

## Requirements

- React 18.2 or newer, or 19
- React Native 0.78 or newer, through Expo or a bare project
- NativeWind 4.2 or newer, with **Tailwind CSS 3.x** — NativeWind v4 does not compile with
  Tailwind v4, which is what the web renderer uses
- Node.js 22.12 or newer for development

## Installation

```bash
npm install @asheeui/native
```

The package expects the application to provide the platform's toolchain, so its
setup adapts the application's own configuration rather than replacing it. Three
files and one provider:

```js
// babel.config.js — the interop runtime, which is what turns a className into a style
presets: [
  ["babel-preset-expo", { jsxImportSource: "nativewind" }],
  "nativewind/babel",
];

// metro.config.js — the stylesheet NativeWind compiles (import it from App.tsx too)
module.exports = withNativeWind(getDefaultConfig(__dirname), {
  input: "./global.css",
});

// tailwind.config.js — NativeWind's preset, the eight colour roles as the properties the
// provider paints, and the package's own classes; the globs are absolute, so any install
// layout works
const asheeui = require("@asheeui/native/tailwind-preset");

module.exports = {
  presets: [asheeui],
  content: ["./src/**/*.{ts,tsx}", ...asheeui.content],
};
```

Then wrap the application root in `AsheeUIProvider` — the same name the web renderer uses,
with the same configuration: the axes, the component sections, the palette (`color`) and
`defaultTheme`, which follows the device's colour scheme (`AsheeNativeProvider` is the same
component under its platform name). Three things are worth knowing before the first screen:

- **Do not install `react-native-css-interop` yourself.** NativeWind 4.2.7 ships the copy
  it needs; a pin of your own resolves instead of it, and every component renders unstyled
  with nothing thrown.
- **The palette comes from the configuration, not from `tailwind.config.js`.** The preset
  states each role as `rgb(var(--ashee-<role>) / <alpha-value>)` and the provider supplies
  the values, so a `theme.extend.colors` entry for a role fixes it at build time and stops it
  following `defaultTheme`. The provider accepts the web renderer's own `ExternalConfig` plus
  the platform-only `defaultSize`, so one configuration object — typed `ExternalConfig`, or
  `AsheeConfig` from `asheeui` — describes both renderers.
- **A development build says so when the pipeline is not connected.** The provider checks
  the runtime, the compiled stylesheet and the preset once on mount and warns with the
  cause it found; `verifyNativeWind()` returns the same diagnosis as data.

[React Native](https://www.asheeui.com/platforms/native) documents each step, what each
failure looks like, and the order to check them in.

The published entry points are the package root, `@asheeui/native/section-kit` and
`@asheeui/native/tailwind-preset`; there are no per-component subpaths, so a component is
imported by name from the root and a bundle is reduced by the bundler rather than by the
import path.

## Quick start

```tsx
import { AsheeNativeProvider, Button, Card, Text } from "@asheeui/native";

export function Screen() {
  return (
    <AsheeNativeProvider>
      <Card title="Invoices" description="Three are waiting for approval.">
        <Text>Nothing leaves the device until you send it.</Text>
        <Button onPress={() => undefined}>Approve all</Button>
      </Card>
    </AsheeNativeProvider>
  );
}
```

## Documentation

The documentation is the website, which renders every page as a per-page `.md` variant and
as one `llms-full.txt`:

- [React Native](https://www.asheeui.com/platforms/native) — setup, the styling pipeline, and what the platform decides
- [Installation](https://www.asheeui.com/getting-started/installation)
- [Configuration](https://www.asheeui.com/concepts/configuration)
- [Components](https://www.asheeui.com/components)
- [Accessibility](https://www.asheeui.com/concepts/accessibility)
- [Migration](https://www.asheeui.com/migration)

## Links

- Documentation: https://www.asheeui.com
- Repository: https://github.com/AsheeSoftworks/AsheeUI
- Issues: https://github.com/AsheeSoftworks/AsheeUI/issues

## License

AsheeUI is licensed under the Apache License 2.0; the `LICENSE` file ships with this package,
and the copyright and attribution notices are in `NOTICE` beside it.
[Licensing](https://www.asheeui.com/project/licensing) explains what redistribution requires.
