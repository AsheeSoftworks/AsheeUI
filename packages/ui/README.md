# @asheeui/ui

The AsheeUI umbrella package: one import, two renderers. An application names a
component once, and the resolver decides which implementation answers — the DOM
renderer in a browser bundle, the React Native renderer under Expo and Metro.

## Installation

```bash
npm install @asheeui/ui
```

```tsx
import { Button, Page, PageContent } from "@asheeui/ui";
```

`@asheeui/ui` depends on `@asheeui/web` and `@asheeui/native`, re-exports the
component surface of each, and adds the `@asheeui/core` helpers both platforms
offer, so the same import works wherever the application runs.

Nothing is decided at runtime. The manifest's `react-native` field, the
`react-native` condition of the exports map and the platform extension Metro
resolves (`index.native.ts` beside `index.ts`) are what route an import, which is
why a browser bundle carries no React Native and a native bundle carries no DOM.

An application that knows its platform can install a renderer instead —
`@asheeui/web` or `@asheeui/native` — and read the same components without the
umbrella. Two entry points stay with the web package: the stylesheet,
`@asheeui/web/styles`, and the Puck configuration, `@asheeui/web/puck`.

## Requirements

| Requirement | Version |
| --- | --- |
| React | 18.2 or newer, or 19 |
| React DOM | the same major as React, for the DOM renderer |
| React Native | 0.78 or newer, and NativeWind 4.2 or newer, for the native renderer |
| Tailwind CSS | 4.0 or newer |

## Documentation

The framework documentation lives in the repository:

- [Installation](https://github.com/AsheeSoftworks/AsheeUI/blob/main/docs/installation.md)
- [Configuration](https://github.com/AsheeSoftworks/AsheeUI/blob/main/docs/configuration.md)
- [Components](https://github.com/AsheeSoftworks/AsheeUI/blob/main/docs/components.md)
- [React Native](https://github.com/AsheeSoftworks/AsheeUI/blob/main/docs/native.md)
- [Migration](https://github.com/AsheeSoftworks/AsheeUI/blob/main/docs/migration.md)

## Links

- Documentation: https://asheeui.com
- Repository: https://github.com/AsheeSoftworks/AsheeUI
- Issues: https://github.com/AsheeSoftworks/AsheeUI/issues

## License

AsheeUI is licensed under the [Apache License 2.0](../../LICENSE). Copyright and
attribution notices are in the root [NOTICE](../../NOTICE) file; the repository's
[licensing guide](../../docs/licensing.md) explains what redistribution requires.
