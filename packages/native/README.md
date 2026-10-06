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
- NativeWind 4.2 or newer
- Node.js 22.12 or newer for development

## Installation

```bash
npm install @asheeui/native
```

The package expects the application to provide the platform's toolchain, so its
setup adapts the application's own configuration rather than replacing it: install
the peer dependencies, enable the NativeWind preset in Babel and Metro, extend the
Tailwind configuration with the theme roles the components reference (`primary`,
`secondary`, `danger`, `warning`, `success`, `background`, `foreground`), and wrap
the application root in `AsheeNativeProvider`. [React Native](../../docs/native.md)
documents each step.

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

The framework documentation lives in the repository:

- [React Native](https://github.com/AsheeSoftworks/AsheeUI/blob/main/docs/native.md)
- [Installation](https://github.com/AsheeSoftworks/AsheeUI/blob/main/docs/installation.md)
- [Configuration](https://github.com/AsheeSoftworks/AsheeUI/blob/main/docs/configuration.md)
- [Components](https://github.com/AsheeSoftworks/AsheeUI/blob/main/docs/components.md)
- [Accessibility](https://github.com/AsheeSoftworks/AsheeUI/blob/main/docs/accessibility.md)
- [Migration](https://github.com/AsheeSoftworks/AsheeUI/blob/main/docs/migration.md)

## Links

- Documentation: https://asheeui.com
- Repository: https://github.com/AsheeSoftworks/AsheeUI
- Issues: https://github.com/AsheeSoftworks/AsheeUI/issues

## License

AsheeUI is licensed under the [Apache License 2.0](../../LICENSE). Copyright and
attribution notices are in the root [NOTICE](../../NOTICE) file; the repository's
[licensing guide](../../docs/licensing.md) explains what redistribution requires.
