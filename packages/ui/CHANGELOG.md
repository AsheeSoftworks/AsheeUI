# asheeui

## 2.3.0

### Minor Changes

- Export the select component as `Dropdown`, the name the documentation now uses.
  
  - `Dropdown` is the same component as `Dropmenu` — one element, one set of props and one configuration
    section (`components.dropmenu`, because a key names the module rather than the export) — so neither name is
    a fork of the other and code written against either keeps working.
  - `DropdownProps` is exported as the props type, the same shape as `DropmenuProps`.
  - The web renderer's default placeholder reads `Dropdown...`, and the multi-select's empty trigger reads
    `Select options`, which is the wording the native renderer already used.
  - The compatibility matrix records the alias beside the component.
  - The docs name the component a dropdown throughout, which is what the alias exists to match.

### Patch Changes

- A button rendered as a link keeps its own text decoration and its own ink.
  - `href` and `link` make a `Button` an anchor, and a page that styles its links — a documentation body
    states `.page-prose a`, a product may state `a { text-decoration: underline }` — was drawing the rule
    straight through the label. `no-underline` is now part of the button's base classes, so the element
    stops looking like prose the moment it becomes a link.
  - A filled treatment carries its label in the ink that reads against the fill (`text-on-solid`), and the
    quieter treatments keep their own colour. That was already the rule the variant map stated; it is now
    asserted, so a solid button cannot lose its white label to a page's anchor rule without a test saying
    so.
- The Sidebar stops drawing its own collapse control, and publishes the state the application's control
  reads instead.
  - `useSidebarCollapse` is new on both renderers. It returns `isCollapsed`, `collapsible`,
    `setCollapsed` and `toggleCollapse` for the nearest `Sidebar`, so a page can fold the column from a
    button of its own — in the column's `footer` slot, or anywhere else inside it — in its own style and
    its own words. Outside a column the hook warns once in development and reports a state that cannot
    move, so the control renders disabled rather than pretending to work.
  - The built-in button is gone: no more "Collapse sidebar" chevron in the footer, and no
    `showCollapseButton` option on the shared contract, which could only ask for a control the framework
    no longer draws. `collapsible` stays, and every request is refused when it is `false`.
  - A control outside the column keeps working the way it always did: `isCollapsed` with
    `onCollapseChange` is the controlled form, and `useState` beside the button is enough.
  - The footer slot is drawn in both states rather than only while expanded, because the control that
    folds the column away is usually in it: hiding the slot hid the only way back. Its wrapper clips
    instead of widening the rail.
  - The column no longer overflows in the x axis: the root is capped at its container's width, the
    navigation body is an explicit vertical scroller rather than one that the browser also scrolls
    sideways, and a label in a row shrinks to the room the row has.
  
  The docs page for the component, and its collapsed demo, show the application's own control reading
  `useSidebarCollapse`.
- Updated dependencies
- Updated dependencies
- Updated dependencies
  - @asheeui/core@2.3.1
  - @asheeui/web@2.5.0
  - @asheeui/native@2.5.0

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
  
  **`asheeui`** drops its `@puckeditor/core` optional peer. The umbrella never exported
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
  - `asheeui` is the umbrella entry point over the two renderers, and it is a new name rather than the one the library published under: the unscoped `asheeui` package is superseded rather than kept, so the entry point a consumer installs is scoped like the rest of the family. Its `main` reaches `@asheeui/web`, and its `react-native` field — with the `react-native` condition of its exports map and the `.native.ts` sibling Metro resolves — reaches `@asheeui/native`. An import of `asheeui` therefore names a component once and works on both platforms, and a browser bundle never contains React Native.
  - `@asheeui/cli` follows the new package names in the imports it writes and in the theme checks it runs.
  
  Import specifiers change once: the umbrella import `asheeui` becomes `asheeui`, `asheeui/styles` becomes `@asheeui/web/styles` and `asheeui/puck` becomes `@asheeui/web/puck`. `@asheeui/shared` is gone; its contracts, tokens and helpers are in `@asheeui/core`, which both `asheeui` and `@asheeui/web` re-export.
  
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
