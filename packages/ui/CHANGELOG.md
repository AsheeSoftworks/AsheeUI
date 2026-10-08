# @asheeui/ui

## 2.2.1

### Patch Changes

- The Puck integration moves out of `@asheeui/web` into a package of its own, routed by
  platform the way the umbrella is.
  
  **`@asheeui/puck`** is new. It has one entry point and two branches, resolved from the
  manifest rather than at runtime: the web branch is the editor's block registry
  (`asheePuckConfig`), the editor's page renderer and the fields a builder fills in, and the
  native branch is the same block specs plus a renderer that draws a stored page with
  `@asheeui/native`. The specs — the label a builder shows, the fields it fills in, the
  value each block starts as — live once in a shared layer that imports no renderer and
  nothing from `@puckeditor/core`, which is what keeps the editor an optional peer the web
  branch alone needs and lets a native bundle reach the package at all. `PuckPage` renders a
  stored page: the editor's own `Render` on the web, the native walker on a device.
  
  **`@asheeui/web`** loses the `./puck` subpath, its `@puckeditor/core` peer dependency and
  its Puck build entry. It gains two things. `@asheeui/web/section-kit` exposes the heading
  and action-row helpers the Puck blocks compose with; the kit stays off the main entry, as
  before. And the package now exports `useAsheeConfig`, `useAshee` and `AsheeConfigContext`,
  which the Puck page shell reads to tell whether an application already provided a
  configuration before it renders one of its own. No component, prop or configuration key
  changes.
  
  **`@asheeui/native`** gains `@asheeui/native/section-kit` for the same reason.
  
  **`@asheeui/ui`** drops its `@puckeditor/core` optional peer. The umbrella never exported
  the Puck integration, so the entry described a dependency no import of the umbrella could
  reach; the package that does export it declares it now.
  
  `@asheeui/web/puck` was created in the same unreleased work this changeset is part of, so
  no consumer can have depended on it and no deprecation window applies: the migration is
  `asheeui/puck` → `@asheeui/puck`. [Migration](../docs/migration.md),
  [Puck](../docs/puck.md) and [Native](../docs/native.md) record the change, and decision
  0024 states why.
- Updated dependencies
  - @asheeui/web@2.3.0
  - @asheeui/native@2.3.0

## 2.2.0

### Minor Changes

- ba4222d: Split the library into a platform-neutral core, a web renderer and a native renderer,
  behind one entry point that routes to the right one.
  
  - `@asheeui/core` is new: the platform-neutral layer, built by Vite, that both platforms consume. It holds the design language, the component contracts, the compatibility matrix, the component registry, the cascade, the configuration pipeline, and the class dictionaries each renderer compiles. It depends on no platform and imports no React runtime. It replaces `@asheeui/shared`, which was a source-only folder rather than a package a consumer could install.
  - `@asheeui/web` is the DOM renderer: the React components, the icons, the Puck integration and the theme binding that reads the document and browser storage.
  - `@asheeui/native` is the React Native renderer. It consumes `@asheeui/core` instead of `@asheeui/shared`, and it no longer defines its own Button class strings: both renderers' strings now live in core, side by side, so a change to the scale is one edit.
  - `@asheeui/ui` is the umbrella entry point over the two renderers, and it is a new name rather than the one the library published under: the unscoped `asheeui` package is superseded rather than kept, so the entry point a consumer installs is scoped like the rest of the family. Its `main` reaches `@asheeui/web`, and its `react-native` field — with the `react-native` condition of its exports map and the `.native.ts` sibling Metro resolves — reaches `@asheeui/native`. An import of `@asheeui/ui` therefore names a component once and works on both platforms, and a browser bundle never contains React Native.
  - `@asheeui/cli` follows the new package names in the imports it writes and in the theme checks it runs.
  
  Import specifiers change once: the umbrella import `asheeui` becomes `@asheeui/ui`, `asheeui/styles` becomes `@asheeui/web/styles` and `asheeui/puck` becomes `@asheeui/web/puck`. `@asheeui/shared` is gone; its contracts, tokens and helpers are in `@asheeui/core`, which both `@asheeui/ui` and `@asheeui/web` re-export.
  
  The CLI resolves project paths independently of the separator, so the config import
  it writes and the file paths in its reports are the same on Windows as they are on
  macOS and Linux.

### Patch Changes

- Updated dependencies [ba4222d]
- Updated dependencies [a12c250]
- Updated dependencies [54d0ed8]
- Updated dependencies [da065da]
- Updated dependencies [ba4222d]
- Updated dependencies [54d0ed8]
- Updated dependencies [e9539c4]
- Updated dependencies [1a69cbb]
- Updated dependencies [15e52a4]
- Updated dependencies [6a5eeba]
- Updated dependencies [54d0ed8]
- Updated dependencies [5ee11fe]
- Updated dependencies [89cce39]
- Updated dependencies [232e1b5]
- Updated dependencies
- Updated dependencies [ba4222d]
- Updated dependencies [54d0ed8]
- Updated dependencies [398ba4b]
- Updated dependencies [ba4222d]
  - @asheeui/core@2.2.0
  - @asheeui/native@2.2.0
  - @asheeui/web@2.2.0
