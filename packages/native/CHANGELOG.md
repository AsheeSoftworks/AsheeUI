# @asheeui/native

## 2.8.0

### Minor Changes

- # The platform renderer catches up
  
  The platform package now publishes the shared vocabulary under the names the web renderer uses, so a
  shared component compiles on both branches without a platform import.
  
  ## Names and contracts
  
  - **The shared type vocabulary and configuration sections** are published under the names
    `@asheeui/core` declares (`ExternalConfig`, `Color`, `Radius`, `Size`, `Space`, `Variant`,
    `ThemeName`, the per-component `*Config` shapes).
  - **The provider answers to the web's names**: `AsheeUIProvider`, `AsheeUIProviderProps` and
    `AsheeConfig`; the earlier platform names stay as deprecated aliases.
  - **The platform's fallbacks and defaults answer to the shared spellings** (`FALLBACK_X_CONFIG`,
    `defaultXConfig`), as the same references, with the platform's values (`LAW-2`).
  - **`useAshee`, `usePrefersReducedMotion` and `useTheme`** exist beside `useAsheeConfig`,
    `useReduceMotion` and the platform host; `useAsheeConfig()` returns core's `Config` shape plus the
    platform's density.
  - **The event names are one vocabulary**: `onClick`, `onPress`, `onChange`, `onChangeText`,
    `onFilesSelected` and the field's `label`/`typography` are accepted in the same order the resolver
    states.
  
  ## Components
  
  - **Composition props**: `Button` gains `startContent`/`endContent`/`icon`, `type="submit"`/`"reset"`
    and `href`; `Badge` gains `label` and the two slots; `Card` gains `image`/`src`/`alt`/`body` and
    `isClickable`; `Image` accepts `loading` as a documented no-op.
  - **Fields**: `Input` maps the web's `type` to `keyboardType`/`autoComplete`/`secureTextEntry`;
    `PasswordInput` exists; the field family accepts `startContent`/`endContent`, `isLoading`,
    `fullWidth`, `required` and `labelAlign`; the status role resolves through core's rule.
  - **Tables**: `Table` and `DataTable` exist, rendering through `RowList`, under the web's names.
  - **Overlays**: `Modal` and `Drawer` draw a close control (`closeLabel`); `closeOnEscape` maps to the
    platform's own way out; the announcement contract is installed.
  - **Substitution**: `Link`, `Image` and `Navbar` accept the shared `Substitution` and
    `LinkSubstitution`, so a shared screen keeps its router on a device.
  - **Typography** resolves the shared role table and the four token overrides, and reads
    `components.typography`.
  - **`cn`** is the platform's own merge (property families, last one wins, no value rewritten);
    `classNames` is a deprecated alias of it.
  
  ## Accepted but not applied
  
  Every prop the web accepts and a device cannot honour now says so once, in development, with a
  substitute (`warnUnsupportedProp`, `useUnsupportedProps`, `auditUnsupportedConfig`). The ledger is the
  documentation's "K/R ledger".
  
  No deprecated alias is removed in this release: they stay until the next major.

### Patch Changes

- Updated dependencies
  - @asheeui/core@3.0.0

## 2.7.0

### Minor Changes

- 67aa8dc: One name for text, one for activation, and a page-title role: the three pieces of parity a component shared by both
  renderers needs.
  
  **`Text` on both branches of the umbrella.** The renderers call the same component by different names — the DOM package
  exports `Typography`, the platform package exports `Text` — and each name is right for its own ecosystem. That is a real
  difference between the packages and an artificial one for an application, whose shared components are the whole point of
  the umbrella: a component that had to write `Typography` on the web and `Text` on a device could not be shared at all.
  `asheeui` now states `Text` for both: this is `Typography` on the web branch, already `Text` on the native one. Nothing
  is renamed inside the renderers — `Typography` and `Text` both stay exported, with the same props — which makes it an
  alias rather than an adapter.
  
  **`Button` accepts `onPress` on the web.** `onClick` is the DOM's event and `onPress` is React Native's, and they are the
  same act: the button's guarded handler already refuses a disabled control and already runs on keyboard activation, so
  both names reach the same place. A shared component cannot pass both from its own code — one of the two props does not
  exist on the other renderer — so the DOM button now accepts the platform's name as well. When both are given, both run,
  `onClick` first. The prop is consumed by the button rather than forwarded to the element, so React does not report it as
  an unknown attribute.
  
  **A `page-title` typography role.** A shared page frame has to state "this is the page's own title" once, and there was
  no way to say it: on the web the title must be an `h1` (the document outline, and the element a host stylesheet sets the
  display face on) while `heading-lg` renders `h2`, and only `heading-xl` reaches `h1` — which is a size, not a meaning.
  `page-title` carries `heading-lg`'s treatment with `h1` as its default element, so a page adopting it does not change
  size. The platform's `Text` states its own heading treatment for it, exactly as it does for every other role.
  
  **One typography-role union.** `@asheeui/native`'s `NativeTextRole` was a second list that happened to match the web's,
  and `page-title` is what that cost: the platform's copy did not know the new role, so the native `Text` refused the role
  the umbrella was handing it. It is now `@asheeui/core`'s `TypographyRole`, so a role added for one renderer cannot exist
  without the other compiling it.

### Patch Changes

- 67aa8dc: `NativeExternalConfig` accepts the web renderer's configuration with `components` explicitly `undefined`.
  
  Found while wiring an application that passes one configuration object to both providers: under
  `exactOptionalPropertyTypes`, a value typed as `@asheeui/web`'s `ExternalConfig` was refused by
  `NativeExternalConfig`, because `components` on the web's type is `ComponentsConfig | undefined` and the device's
  intersection did not admit the `undefined` arm. The property now states the union with `undefined`, so the promise
  `AsheeNativeProvider` makes — it accepts the web renderer's configuration, made when the two types were unified — holds
  under the strict flags applications enable.
- Updated dependencies [67aa8dc]
  - @asheeui/core@2.5.0

## 2.6.0

### Minor Changes

- 032a30d: One configuration describes both renderers, palette included: the device now paints the
  theme the configuration states, and the provider answers to the name the web one uses.
  
  **The palette is the configuration's.** `AsheeNativeProvider` accepts the same `color` and
  `defaultTheme` the web renderer does and applies them: `@asheeui/core` resolves the palettes
  (it exports `resolveColorConfig` now, with `PALETTE_ROLES`, `colorChannels`, `paletteVariables`
  and `selectTheme` beside it), the preset states each role as
  `rgb(var(--ashee-<role>) / <alpha-value>)`, and the provider paints those custom properties
  with NativeWind's `vars()`. So `bg-primary` names a role rather than a colour: a device and a
  browser render one palette from one object, `defaultTheme: "system"` follows the platform's
  colour scheme, and a custom theme declared under `color` works on both.
  
  - A role is opaque and must be a hex, `#rgb`/`#rgba` or an `rgb()`/`rgba()` value, because a
    variable in that position holds channels; a value the platform cannot read is an error
    naming the role instead of a surface that paints nothing.
  - `defaultTheme` naming a theme the configuration does not declare is an error rather than a
    silent fall back to light.
  - The preset no longer states colour values of its own. An application that writes role
    colours in `theme.extend.colors` keeps a build-time palette and has traded the runtime one
    for it, which the docs now say; deleting those lines is what moves it onto the
    configuration's palette.
  - The provider claims the height it is given (`flex-1`), because a screen's shell grows into
    the screen; it belongs at the root, where the documentation already put it.
  
  **One root, one configuration type.** `@asheeui/native` exports `AsheeUIProvider`,
  `useAsheeConfig` and `AsheeUIProviderProps` beside the platform names, so a shared root reads
  the same on both platforms. `asheeui` exports `AsheeConfig` from each branch — `ExternalConfig`
  on the web, the native interface on a device — so a configuration file that both platforms
  read names one type and compiles for both, while an option only one platform honours stays
  refused by the other rather than accepted and ignored.
  
  **Documentation.** The native page's setup now states the palette and theme as part of the
  configuration, records that role colours in `tailwind.config.js` override the runtime palette,
  and lists that among the causes of an unstyled role.
- 8207bfd: A correctly configured application renders styled again, and the setup it needs is one line
  shorter than it was.
  
  **The defect: `dist` emitted the wrong JSX runtime.** The published artifact was compiled with
  TypeScript's default emit, `react/jsx-runtime`. NativeWind does not read `className` at runtime
  — its Babel transform rewrites JSX — and a compiled module contains neither JSX nor
  `React.createElement`, so a consumer's Babel had nothing to rewrite: the `className` stayed a
  plain prop on a `View`, and React Native ignored it. Every framework component rendered with
  no style at all. The copy was right, the structure was right, and there was no padding, no card
  surface, no border, no type scale, the status bar over the first heading — and nothing thrown
  or warned to say so. 68 of the artifact's modules emitted that way — every component and every
  layout primitive in it — and the test suite could not see it, because the suite compiles this
  package's sources, and sources contain JSX.
  
  - `tsconfig.build.json` states `jsxImportSource: "nativewind"`, so a component's `className`
    reaches the runtime that turns it into a style.
  - `pnpm check:native-artifact` reads `dist` and fails when any published module imports
    `react/jsx-runtime`, or when no module imports the interop runtime at all. CI, the
    distribution workflow and the release path run it after the build, which is where this
    belonged: the tests cannot make this assertion, and the artifact is what a consumer installs.
  - The build cleans `dist` before it compiles, which it did not do. The published 2.5.0 tarball
    carried 176 stale modules at the pre-2.3.1 flat paths — a second copy of every component,
    62 of them emitting through React's runtime.
  
  **The preset: `@asheeui/native/tailwind-preset`.** The setup used to ask the consumer to write
  three things by hand, and two of them could not be written correctly without knowing how their
  package manager laid out `node_modules`.
  
  ```js
  // tailwind.config.js
  const asheeui = require("@asheeui/native/tailwind-preset");
  
  module.exports = {
    presets: [asheeui],
    content: ["./src/**/*.{ts,tsx}", ...asheeui.content],
  };
  ```
  
  - It chains NativeWind's own preset, states the eight colour roles at the framework's light
    palette (`defaultColorConfig.light`, which is what the web renderer paints from — a test
    keeps the copy honest), and states the package's own compiled modules as **absolute** globs.
    An absolute glob is the fix for the second half of the install trap: `@asheeui/native` is not
    at `node_modules/@asheeui/native` under pnpm, Bun's isolated installs or npm with a different
    peer set, and a documented relative glob matched nothing, so a consumer who followed the
    advice exactly still compiled none of the framework's classes.
  - `content` is exported as well as declared because Tailwind v3 does not merge a preset's
    `content` into a configuration that states its own; the spread is what carries it.
  - `asheeui/tailwind-preset` re-exports it, so an application that installed the umbrella — and
    therefore cannot reach the native package by name — states the same setup. `./package.json`
    is exported on both packages, for the tooling that reads a manifest to discover a version.
  
  **The diagnosis: `verifyNativeWind()`.** Every failure in this area has one shape, an unstyled
  screen with nothing to read. The provider now checks the pipeline once in a development build
  and warns with the cause it found: it compares the runtime the framework's own components use
  against React's, then asks NativeWind's `verifyInstallation()` about the Babel transform, the
  compiled stylesheet data and its preset. `verifyNativeWind()` returns the same report as data
  for a test or a script. A production bundle and a test run carry none of it.
  
  **Toolchain.** The package's own `tailwindcss` devDependency was v4, which NativeWind v4 cannot
  compile with and which the docs never told a consumer to install — the preset could not even be
  loaded in this repository until it moved to v3.4, the line a consumer runs.
  
  **Docs.** The native setup page now states the stylesheet import, the interop pairing
  (`nativewind` 4.2.7 ships `react-native-css-interop` 0.2.7, and a pin of your own silently
  disables every style), the preset, a role's required colour form for opacity modifiers, and the
  five causes of an unstyled screen in the order they are worth checking. The package README's
  documentation links pointed at a `docs/native.md` that no longer exists in the repository and
  returned 404 to an anonymous visitor; they point at the site now.

### Patch Changes

- a450df1: `AsheeNativeProvider` accepts the web renderer's configuration type, so one configuration
  object describes both renderers without a per-platform type.
  
  `NativeExternalConfig` now extends `@asheeui/core`'s `ExternalConfig` — the type
  `@asheeui/web` takes — and adds only what the platform has on its own: `defaultSize`, and the
  component sections the web renderer declares in its own package rather than in the core
  (`card`, `typography`, `container`, the field family and the layout ones). A configuration
  typed `ExternalConfig` is therefore accepted here unchanged, and `AsheeConfig` is that same
  type under the name `asheeui` resolves per platform.
  
  A native-only installation still configures every section it has, because those sections are
  added by this package; an unknown section, or a key spelled the export's way rather than the
  registration's (`searchInput` for `searchinput`), is still refused by the type checker.
- Updated dependencies [032a30d]
- Updated dependencies [b65009f]
  - @asheeui/core@2.4.0

## 2.5.0

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

## 2.4.0

### Minor Changes

- Give every band the heading level it should have had, and make the configuration types tell the
  truth.
  
  **Headings**
  
  - `SectionHeading` renders `<h2>` at **every** size, and `titleAs` is the one lever — up to `h1`
    when the band really is the page's title, down to `h3` inside a card. Before, the large sizes
    silently became `<h1>`: a page composing a hero and a closing call to action rendered two.
  - `Hero`, `CTA`, `FeatureGrid`, `Testimonials` and `PricingCard` all expose `titleAs`;
    `FeatureGrid` and `Testimonials` also expose `headingSize`.
  - Every band now renders a **named** `<section>` — `aria-labelledby` pointing at its own heading —
    so it is a `region` landmark rather than an anonymous grouping. A consumer's own `aria-label` or
    `aria-labelledby` still wins.
  - `AuthLayout`'s title follows the same rule and is now an `<h2>`.
  - `EmptyState` and `ErrorState` gained `titleAs` as well, so a state can sit at the right level.
  
  **Marketing**
  
  - `PricingCard`'s `highlighted` is instance-only: it is no longer part of `PricingCardConfig`, so
    `components.pricingcard.highlighted: true` can no longer recommend **every** plan.
  - `FeatureGridLink.mapProps` lets a feature's link state its own destination (`to` for a router)
    instead of always receiving `href`.
  - A testimonial's avatar is decorative now (`alt=""`), so the person's name is announced once, by
    the caption.
  - `Card` merges a link's `className` into its own classes instead of letting it replace the whole
    string.
  
  **Configuration that now behaves as documented**
  
  - A custom theme's name is an ordinary string: `color: { midnight: … }`, `defaultTheme: "midnight"`
    and `themeController.setTheme("midnight")` all compile without a registry declaration or a cast.
    Existence is still validated at runtime, so a typo in `defaultTheme` throws.
  - `extends` may name another **declared** custom theme, in any declaration order; an undeclared name
    is still rejected, and a cycle now warns in development instead of being silently mis-based.
  - `color-scheme` is written on every theme application, so a runtime switch moves the browser's own
    surfaces with it.
  - Only the outermost provider emits the pre-paint script and owns the document's default theme: a
    nested provider adds themes to the controller and the stylesheet, but no longer sets the default
    or paints over the application.
  - `availableThemes` is `readonly ThemeName[]`, the same type `setTheme` takes.
  - `Input` no longer reads the global `defaultVariant` (the field family never did); its registration
    is what keeps fields `bordered`.
  - `HStack`/`VStack` now honour `components.stack.direction` and `.align`; the preset value sits below
    the component config, and those two axes are no longer registered defaults.
  - `Page`'s parts accept only the options they act on: `<Page sticky>`, `<PageHeader spacing>`,
    `<PageContent sticky>` and `<PageFooter spacing>` are type errors instead of silent no-ops.
    `PageContent.className` styles the rendered element; `innerClassName` styles the inner column.
  - `DocsLayout` gained `stickyNavigation` (registered `true`); `ResizableScreen`'s container
    minimums are configuration too (`components.resizableScreen`, registered 200).
  - `LoadingState`'s registered floor is `md`, and it finally binds: the state claims more room than
    its own content, which was the point of the option.
  - A `Sidebar` inside a `SidebarLayout` column no longer nests a second complementary landmark, and
    `navLabel` defaults to `"Sidebar navigation"` so the two landmarks have distinct names.
  
  **Smaller corrections**
  
  - `Toast`'s default treatment follows the application's `defaultVariant` (it no longer registers
    `variant`), its manual dismissal plays the exit animation, its landmark names carry the placement,
    and `useToast()` outside a provider warns once in development.
  - The spinner's rotation is inside `motion-safe`.
  - `Button`'s busy ring matches the control's size.
  - `EmptyState`'s announcement is configurable (`components.emptystate.role`, default `none`), the
    same decision `ErrorState` already exposed.
  - `DataTable` and `RowList` take `rowCount` for a remote list and `searchDebounce` (registered `0`)
    for a search that hits a server; `components.datatable.loadingLabel` says what is loading.
  - `DataTable`'s empty state is a status only while it answers a query, and its loading region is
    labelled `Loading results` by default.
  - `DataTable` can now be paged and counted from one page of rows.
- Bring the native renderer back into agreement with the web renderer.
  
  Every fix below was made on web first because the component promised the behaviour: the native
  renderer carried the same defect, and now states the same rule in the platform's vocabulary.
  
  - `Image` no longer registers a `radius`, so a picture follows the application's `defaultRadius`;
    and the skeleton no longer pulses forever when there is no source.
  - `Avatar` retries a new `src` after a failure instead of showing the initials for the life of the
    slot.
  - `Chip` gives its `avatar` slot a scale of its own (16, 20 and 24), instead of sizing a portrait
    with the icon map.
  - `Card` resolves its `variant` through the cascade rather than pinning `bordered`, and maps the
    shared treatment vocabulary onto the surfaces it draws. **Note:** native's platform
    `defaultVariant` is `solid`, so an unconfigured native card now renders its filled surface
    rather than a border. State `components.card.variant` to keep the bordered look.
  - `Carousel` hides non-active pages from assistive technology and from focus, resolves `variant`
    through the shared `resolveCarouselVariant` instead of casting and silently falling back,
    sentences its two arrow labels, and does not start autoplay when the device asks for less motion.
  - `Marquee` renders one copy in a scrollable frame when motion is declined instead of clipping the
    overflow, keeps its duplicate copy out of the focus order, pauses while focus is inside it, and
    agrees with its registered defaults about `pauseOnHover` and `fadeEdges`.
  - `Clipboard` reports failure instead of success when there is nothing to copy, announces a failed
    copy through `errorAnnouncement`, and honours `components.clipboard.radius`.
  - `Accordion` resolves `disableAnimation` through the cascade, and keeps a disabled item reachable
    and announced through `accessibilityState` instead of removing it with `disabled`.
  - `Sidebar` names a collapsed row, honours `SidebarSection.disabled`, and keeps its footer.
  - `Tabs` falls back to the first tab when `activeId` names none, so the bar is always operable.
  - `Stepper` scales its labels with `size` as well as its markers, keeping `md` unchanged.
  - `Navbar` states its brand's layout once instead of on two nested elements.
  - `RowList` announces an empty result only while it answers a query, not on first paint, and
    formats its row count through the shared `rowCountLabel` template.

### Patch Changes

- Updated dependencies
- Updated dependencies
- Updated dependencies
- Updated dependencies
  - @asheeui/core@2.3.0

## 2.3.1

### Patch Changes

- Group the component folders into categories.
  
  `@asheeui/core`, `@asheeui/web` and `@asheeui/native` now arrange their components under
  sibling category folders — `layouts`, `navigation`, `forms`, `feedback`, `overlays`,
  `data-display`, `marketing`, `typography` and `system` — instead of one flat
  `components/` directory, and the relative imports and module augmentations were rewritten
  to match. **The public export surface is unchanged**: every component keeps its name, so
  a consumer's imports and the `@asheeui/web/section-kit` subpath are unaffected.
  
  `asheeui list` follows the new arrangement. It derives a component's name from the last
  path segment and its category from the first, prints the inventory grouped under a
  heading per category with its count, and `--json` reports each entry as
  `{ "name", "group" }` so a script can group it the same way.
- Updated dependencies
- Updated dependencies
  - @asheeui/core@2.2.1

## 2.3.0

### Minor Changes

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

## 2.2.0

### Minor Changes

- ba4222d: Native gains `Calendar`, which is the last member of the field family, and the shared layer
  gains the class strings its field's trigger is built from.
  
  - `@asheeui/native` implements `Calendar`: a date, time or datetime field that satisfies the
    contract its web counterpart already states, resolves the same cascade and draws the same
    label block. What the platform forces is drawn and recorded rather than ignored. The field
    opens its calendar on one surface at a time, because the platform has no floating layer for
    a panel beside a control, and the time is stepped through columns rather than typed or
    picked from a platform clock, because a platform time picker takes a colour *value* while
    the contract names a colour *role*, and a control that cannot resolve the role would accept
    the prop and ignore it. Everything that is not the platform's is read from `@asheeui/core`:
    the month grid, the written form of a chosen date, the two rules that decide which cells a
    reader may reach (`isFutureDay` and `canGoToNextMonth`), and the vocabulary an empty field
    speaks — so a day the web refuses is a day native refuses, and a field that is cleared,
    disabled or marked invalid reports the same thing on both platforms.
  - `@asheeui/core` gains the class strings the native calendar field's trigger is built
    from: the trigger itself, the row that holds its glyph and its clear control, the clear
    control, and the clear control's label. They sit beside the surface classes the calendar
    module already carried, so the class strings both renderers compile are still one module
    rather than two lists that drift apart.
  - `docs/native.md` records what shipped and why two of the calendar's behaviours are the
    platform's rather than a preference. The parity queue shrinks accordingly —
    `pnpm check:native-parity` now reports 24 of 58 promised components implemented.
- a12c250: Native gains the clipboard pair — `Clipboard` and `CopyButton` — and the contract the two
  read is stated once in `@asheeui/core`.
  
  - `@asheeui/native` keeps the pair's shape: `Clipboard` is a render function with a state
    (whether the text is on the clipboard, whether the last attempt failed, how to copy, how
    to clear) and `CopyButton` is the framework's control built on it, so a consumer with an
    icon in a row or a menu item uses the primitive and gets the same behaviour the button
    has. The copied state is a timer on both platforms, cleared on unmount, and nothing is
    written during a render.
  - What performs the write is what differs. The browser has a clipboard API with a
    selection fallback; the platform has its own module, which the package reads through a
    binding of its own (`writeToClipboard`) rather than reaching for a third-party clipboard
    package every consumer's bundle would pay for. A refused write rejects with the platform's
    own cause, which is what a consumer's `onError` receives.
  - The control's affordances are characters where the web's are drawings: the package ships
    no icon set, so the copy glyph and the framework's tick stand in for `CopyIcon` and
    `CheckIcon`, and a consumer who wants a drawing passes `copyIcon` or `copiedIcon`. The
    button's accessible name is its label rather than its label with a glyph in front of it,
    because a reader asked to press "Copy" should hear "Copy".
  - The result is announced the same way on both platforms: a status region beside the
    control repeats what the label now says, because a label change is not announced on
    either. The web hides that region with `sr-only`; the platform has no such utility, so the
    region is a pixel-sized transparent view — out of the way, still in the accessibility tree.
  - `@asheeui/core` gains the clipboard contract (`components.clipboard`) and the one module
    both renderers read for the status region each announces through, along with the
    characters the native control draws.
  - `@asheeui/web` points its pair at those shared modules and its own styles file is removed.
    The rendered markup and the public props are unchanged.
  - The parity queue drops from 13 to 12: 46 of the 58 components the matrix promises for
    native are implemented.
- 54d0ed8: Native gains the content blocks — `Avatar`, `Chip` and `Image` — and the three contracts
  those blocks read are stated once in `@asheeui/core`.
  
  - `@asheeui/native` renders an avatar as a surface holding the consumer's picture, falling
    back to the entity's initials from `getInitials` in `@asheeui/core`, and announces one
    name through one image role rather than the initials and the picture separately. A chip
    keeps the web's anatomy — avatar, leading icon, status dot, trailing icon and remove
    control — and makes the remove control its own control with its own name, drawing its
    affordances from characters because this package ships no icon set; a consumer with a
    drawing passes `closeIcon` and the character stands in when they do not. An image is a
    frame that states the shape the platform cannot infer before a remote source arrives,
    claims its space with the framework's own `Skeleton`, and states the alternatives it
    cannot honour: a picture is fetched when its view mounts, so the web's `loading` option
    has no counterpart here and is not offered.
  - `@asheeui/core` gains the avatar, chip and image contracts (`components.avatar`,
    `components.chip`, `components.image`) and one module per component holding the class
    strings both renderers read, so a token or a picture is dressed from one place. The
    avatar's initials rule moves to the core as `getInitials`, because presenting an entity
    the same way is a promise the platform does not change.
  - `@asheeui/web` points its avatar, chip and image at those shared modules. The rendered
    markup and the public props are unchanged.
  - The parity queue drops from 18 to 15: 43 of the 58 components the matrix promises for
    native are implemented, and the remaining fifteen are the shells, the navigation
    furniture and the data family.
- da065da: Native gains the feedback and state family, and the rules those five share are stated
  once in `@asheeui/core`.
  
  - `@asheeui/native` implements `Alert`, `EmptyState`, `ErrorState`, `LoadingState` and
    the toast system (`ToastProvider`, `useToast`, `ToastItem`) with the platform's own
    mechanisms rather than a web one with the browser removed. A decoration is a character
    rather than a drawing, because the package ships no icon set and its other components
    already draw their affordances from text. The toast stacks its messages in a layer of
    its own, anchored to the bottom centre by default, because the platform's own snackbar
    cannot carry the title, the action or the dismissal the contract names — the same
    argument that keeps the native spinner a themed ring rather than an activity indicator.
    An `EmptyState` has no `as` prop, because the platform has one container, and the
    technical detail of an `ErrorState` is opened from the component's own state, because
    the platform has no `details` element.
  - `@asheeui/core` gains the five modules those components share with the web: the
    configuration both platforms agree on and the class strings each renderer compiles,
    native and web side by side. It also gains the two rules the family would otherwise
    have stated four times: `NATIVE_ANNOUNCEMENT_LIVE_REGION` with
    `resolveNativeAnnouncementRole`, which says how the framework's two levels of
    announcement are made on a platform that has no `status` role, and
    `NATIVE_MESSAGE_SURFACE_CLASS` with `NATIVE_MESSAGE_TEXT_CLASS`, which say what a
    message surface wears in each colour role. The alert and the toast read the same pair,
    so retuning one retunes the other. The toast's fallback timeout and queue depth live
    there too, because they are decisions about a reader's attention rather than about a
    platform.
  - `@asheeui/web` points its alert, empty state, error state, loading state and toast at
    those shared maps, and reads the shared queue limits. The rendered markup and the public
    props are unchanged.
  - The compatibility matrix's `Toast` entry now states what the platform actually does,
    and `scripts/native-parity.json` records `toast` in its overrides: the native
    counterpart of the web's toast module is published as `ToastProvider`, which is the
    component the matrix's guard looks for. The parity queue drops from 34 to 29.
- ba4222d: Native gains the field family, and the shared layer gains the vocabulary its members
  read.
  
  - `@asheeui/native` implements `Textarea`, `SearchInput`, `PinInput`, `Switch`,
    `Radio` with `RadioGroup`, `Dropmenu`, `MultiSelect`, `Autocomplete`, `Form`,
    `Stepper` and `FileUpload`. Each satisfies the contract its web counterpart already
    states and reads the same cascade, the same field vocabulary and the same label
    block; what differs is the platform, and where the platform forces a difference it
    is recorded in the matrix rather than hidden. A code field types into one native
    field behind its boxes, because a native control has a single caret. An
    autocomplete shows its suggestions under the field rather than floating them beside
    it, because a reader comparing what they typed with what it matches has to see both
    at once. A select and a multi-select pick from one surface at a time, because the
    platform has no floating layer, and a file field owns the zone, the list and the
    validation while the consumer wires the platform's own picker to `onChoose`.
  - `@asheeui/core` gains the configuration each member shares with the web plus the
    class strings each renderer compiles, native and web side by side: `switch`,
    `textarea`, `radio`, `search-input`, `pin-input`, `form`, `stepper` and
    `file-upload`. It also gains the rule the two platforms share for a code,
    `sanitizePinValue`, so a web field and a native field cannot filter the same input
    differently.
  - `@asheeui/web` points its switch, textarea, radio, search-input, pin-input, form,
    stepper and file-upload configuration and style modules at those shared modules, and
    re-exports the code field's rule. The rendered markup and the public props are
    unchanged.
  - `docs/native.md` records what shipped, why two members read the platform rather than
    a preference, and why `Calendar` stays queued: a native date field that accepted
    `time` and `datetime` without the platform's time picker would advertise an option
    it ignores. The parity queue shrinks accordingly — `pnpm check:native-parity` now
    reports 23 of 58 promised components implemented.
- 54d0ed8: Native gains the marketing and content blocks — `Hero`, `FeatureGrid`, `CTA` and `Footer` —
  and the band vocabulary those four share is stated once in `@asheeui/core`.
  
  - `@asheeui/native` renders each band with the platform's own layout kit. A hero measures the
    window and puts its media beside the text or under it, and moves the media through the tree
    rather than through an order class, which is the only way to state a side when there is no
    stylesheet. A feature grid reads the window for its column count and renders every feature
    through the framework's own `Card`, so a feature with a destination is a pressable card that
    follows it through the platform's URL handler and one without stays a surface. A call to action
    states the panel density the web states at its smallest step, because one window cannot pad
    itself for a desktop. A footer keeps its brand column above its groups and lets the groups wrap,
    and names each group's title as a heading a reader can move between.
  - `@asheeui/core` gains the four band contracts (`components.hero`, `components.featuregrid`,
    `components.cta`, `components.footer`), the shared grid vocabulary, and the band vocabulary the
    web and native renderers read side by side: the container widths, the background treatments, the
    heading step each size resolves to, and the class dictionaries for the heading block and the
    action row on both platforms. The four bands all extend the same option set, so a hero
    configured for a browser is configured for a device.
  - `@asheeui/web` points its hero, feature grid, call to action and footer at those shared modules,
    and its section kit at the shared heading and action dictionaries. The rendered markup and the
    public props are unchanged.
  - The native layout kit now reads the shared container and background vocabulary, so a `Section`
    written with `background="muted"` and a band written with the same option are talking about one
    idea. `none` paints the theme's own background, because a native screen has no page behind it to
    show through.
  - The native `Grid` now carries the column counts it is given for `md` and `lg`. The cascade
    resolves exactly the keys a fallback declares, so a key left out of the grid's fallback never
    reached it: a grid that stated a count per breakpoint fell back to its smallest count on every
    window, and now states the count the window actually reached.
  - The parity queue drops from 22 to 18: 40 of the 58 components the matrix promises for native are
    implemented, and the remaining eighteen are the shell, content and navigation families.
  - `@asheeui/web` states the tooltip's `className` fallback as well. The overlay increment added that
    option to the shared tooltip contract and left it out of the web fallback, so the package no
    longer type-checked; the value is the option's documented default and the component reads the
    configured value directly, so no rendered tooltip changes.
- e9539c4: Native gains the `MarketingLayout` composition, and the options it takes are stated once in
  `@asheeui/core`.
  
  - `@asheeui/native` holds the page's navigation, its main region of sections and its footer
    in one scrolling region, in the order the web shows them, with the sections inside the
    named main region. Every region is taken as a node, so a consumer passes the framework's
    own navigation, hero, feature grid, call to action and footer, and nothing about their
    content is decided by the composition.
  - What the platform states differently is what it has to scroll. The web is a document that
    grows with what it holds, so its shell is a full-height column and the document scrolls; a
    native screen is given its height by the platform, so the composition is the scrolling
    region itself.
  - Two options the platform keeps in its own vocabulary. The web's skip link is a keyboard
    reader's way past the navigation, and a platform screen has no focus order to skip through,
    so `skipLink` and `skipLinkLabel` resolve through the shared contract and render nothing.
    The web names its main region with an `id` so a link can point at it; the platform names a
    view with `nativeID`, which is the identifier its own reader can be pointed at, so `mainId`
    becomes that.
  - `@asheeui/core` gains the marketing-layout contract (`components.marketinglayout`) and one
    module holding every class string both renderers read: the shell, the background each
    renderer paints, the scrolling content and the main region.
  - `@asheeui/web` points its composition at those shared modules and its own styles file is
    removed. The rendered markup and the public props are unchanged.
  - The parity queue drops from 6 to 5: 53 of the 58 components the matrix promises for native
    are implemented, and the remaining five are the navigation furniture and the three layout
    shells that compose it.
- 1a69cbb: Native gains `Marquee`, and the options it moves by are stated once in `@asheeui/core`.
  
  - `@asheeui/native` moves the content the way the platform can. The web states a keyframe
    animation over a track it has already sized in its stylesheet and translates it by half;
    the platform has neither, so it measures the content once the platform has laid it out,
    keeps an animated value of its own, and translates by the measured length of one set plus
    the gap — the exact distance at which the second copy has taken the first copy's place, so
    the loop has no seam. Until the content has been measured nothing moves, rather than
    jumping to a position nobody chose.
  - The copy is in the tree twice and kept out of the accessibility tree rather than off the
    screen, so a reader hears the items once while the loop still has something to move into
    place — the same promise the web keeps with `aria-hidden`.
  - The movement yields to the platform's own motion setting, through a new
    `useReduceMotion` hook, exactly as the web's yields to the reader's preference: a reader
    can turn the setting on while a screen is open, so the loop follows it and the content is
    read standing still. The new shared `isAnimated` option states the same thing
    deliberately, for a screen that must not move at all, and the web honours it as well.
  - Two of the contract's options are the web's to keep. `pauseOnHover` is a pointer's
    gesture and a touch screen has no pointer resting on anything; `fadeEdges` is a gradient,
    which the platform paints only through a drawing library this package does not depend on,
    and a band of the background colour would be a hard edge pretending to be a fade. Both
    still resolve through the shared contract and are documented as empty classes, so one
    configuration describes both platforms and neither option is silently stripped.
  - The shared gap is a CSS length, because it is one value for both platforms. The platform
    reads it as its own measure (`resolveLength`): the framework's `rem` is sixteen
    density-independent pixels, a `px` is one, and a unit a view cannot state falls back to
    the framework's own gap rather than to a number nobody chose.
  - `@asheeui/core` gains the marquee contract (`components.marquee`) and one module holding
    every class string both renderers read: the frame, the track, the sets, the items, the
    fade gradients and the two native substitutions.
  - `@asheeui/web` points its marquee at those shared modules and its own styles file is
    removed. The rendered markup and the public props are unchanged.
  - The parity queue drops from 12 to 11: 47 of the 58 components the matrix promises for
    native are implemented.
- 15e52a4: Native gains the navigation and disclosure family, and the class dictionaries those four
  share are stated once in `@asheeui/core`.
  
  - `@asheeui/native` implements `Link`, `Tabs`, `Accordion` and `Carousel` with the
    platform's own behaviour rather than with an imitation of the browser's. A link underlines
    itself while it is pressed and follows its destination through the platform's URL handler
    unless the consumer handles the press or names the component that renders it. A tab bar
    scrolls with the platform's scroll view, and is a row of tabs rather than one tablist,
    because a container that is an accessibility element hides the controls inside it. An
    accordion opens with the platform's own layout animation and does not draw a closed panel
    at all, which is what takes it out of the accessibility tree — the platform's answer to the
    web's `inert`. A carousel pages with the platform's scroll view, which is why `loop` wraps
    only its autoplay: a scroll view that teleported its content would be lying about where the
    reader is.
  - `@asheeui/core` gains the four modules those components share with the web: the
    configuration both platforms agree on and the class strings each renderer compiles, native
    and web side by side. Two of them state what a component that has no treatment for the
    platform's filled default does instead, which is resolve it to the treatment the component
    documents.
  - `@asheeui/web` points its link, tabs, accordion and carousel at those shared maps. The
    rendered markup and the public props are unchanged.
  - `scripts/native-parity.json` drops from 29 to 25: 33 of the 58 components the matrix
    promises for native are now implemented.
- 6a5eeba: Native gains the overlays — `Modal`, `Drawer` and `Tooltip` — and the class dictionaries those
  three share are stated once in `@asheeui/core`.
  
  - `@asheeui/native` presents each overlay the way the platform does rather than the way the
    browser does. A modal is the platform's own modal presentation, which takes the screen, keeps
    the reader inside it and hands the framework the platform's way out; the surface takes its own
    presses, so pressing what a dialog holds never dismisses it. A drawer is the sheet the platform
    uses for this — a panel at the side of a phone has nowhere to be, so a side placement resolves
    to the sheet while a top or bottom placement keeps its edge. A tooltip is shown on a long press,
    with the same `delay` the web counts as the length of that press, placed against the platform's
    own measurement of its trigger, and stated as the trigger's accessibility hint as well, so a
    reader using assistive technology is told it without finding the gesture.
  - `@asheeui/core` gains the three modules those components share with the web, including two maps
    that say what the platform does with a placement it has no room for, and the modal's own width
    scale, which is not the framework's three densities.
  - `@asheeui/web` points its modal, drawer and tooltip at those shared maps. The rendered markup
    and the public props are unchanged.
  - The parity queue drops from 25 to 22: 36 of the 58 components the matrix promises for native
    are implemented, and the remaining twenty-two are the marketing, content and shell families.
- 54d0ed8: Native gains the application-screen shell — `Page`, `PageHeader`, `PageContent` and
  `PageFooter` — and the options those four share are stated once in `@asheeui/core`.
  
  - `@asheeui/native` renders the shell the way a screen is built rather than the way a document
    is. The shell is a full-height column that grows into the height the platform gives it; the
    header announces itself as the platform's header landmark, and the parts are contained by
    default, so a screen gets the framework's width and gutter without extra markup. The one
    option the platform cannot honour in place is `sticky`: a native screen has no scroll-linked
    positioning, so a bar that must stay in view belongs outside the scrolling region — the
    platform's own way of pinning a bar — and the resolved value is kept so one configuration
    still describes both platforms. The header also paints the theme's background solidly where
    the web bar is translucent and blurs what scrolls behind it, because there is no backdrop to
    filter.
  - `@asheeui/core` gains the page contract (`components.page`) and one module holding every
    class string both renderers read: the shell, the two bars, the content area, the separators
    and the inner rows, per platform. The web's header row states no direction, because a block
    element lays its children out along the row already; the platform's states the direction it
    means rather than relying on a default.
  - `@asheeui/web` points its four page parts at those shared modules. The rendered markup and
    the public props are unchanged.
  - The parity queue drops from 14 to 13: 45 of the 58 components the matrix promises for native
    are implemented, and the remaining thirteen are the shells, the navigation furniture and the
    data family.
- 5ee11fe: Native gains the `Pagination` collection footer, and the options it reads are stated once in
  `@asheeui/core`.
  
  - `@asheeui/native` states where a reader is in a paged collection and loads more of it,
    because that is how a platform list moves through a collection: the web draws a numbered
    trail — the first and last page, the reader's neighbours, a gap between them and a control
    for each, as a link when addresses are supplied and a button otherwise — and a phone has
    no room for a trail and no address to name. The footer states its position, which is a
    live region so a reader hears where they are as pages load, offers one control that loads
    the next page, and offers nothing once the collection is exhausted; a collection with no
    pages renders no footer at all, because an empty state belongs to the list.
  - The footer never reports a page the collection cannot act on: it clamps the current page
    to the collection, and a press during a load is ignored because the control is disabled.
  - Two options the web's trail needs are stated rather than hidden. `siblingCount` and
    `showEdges` describe how many neighbours to draw and whether the collection's ends are
    offered; the platform's footer draws no range, so they resolve through the shared contract
    — one configuration describes both platforms — and change nothing here. The tests state
    that, so it stays true.
  - `@asheeui/core` gains the pagination contract (`components.pagination`) and one module
    holding every class string both renderers read, including the control and disabled
    treatments the web renderer used to state inline.
  - `@asheeui/web` points its pagination at those shared modules and its own styles file is
    removed. The rendered markup and the public props are unchanged.
  - The parity queue drops from 9 to 8: 50 of the 58 components the matrix promises for native
    are implemented.
- 89cce39: Native gains the `PricingCard` pattern, and the options it takes are stated once in
  `@asheeui/core`.
  
  - `@asheeui/native` renders a plan in the framework's own `Card` and the framework's own
    `Text`, and places several plans with `Stack` exactly as the web places several with
    `Grid`. The plan's name heads the card as the platform's header role, so a reader can move
    from plan to plan.
  - Three things the web draws are stated the platform's way. Included and excluded features
    carry characters rather than drawings, because this package ships no icon set (the
    framework's tick and the dismissal glyph the rest of the native components already draw).
    The recommended plan is marked with the card's own `color`, which is the accent every
    other native surface states, rather than with a ring the platform's card does not paint.
    An elevated plan keeps the raised surface's own colour, because the platform's card paints
    no shadow: the web's `elevated` surface is the framework's filled surface with a shadow,
    and a bordered surface would be the wrong treatment rather than a plain one.
  - The exclusion is stated in words as well as in style on both platforms, and the shared
    module for text that is read rather than seen is now stated once in `@asheeui/core`
    (`VISUALLY_HIDDEN_CLASS` and its native counterpart), rather than beside each component
    that needs it.
  - `@asheeui/core` gains the pricing-card contract (`components.pricingcard`, including the
    `PricingFeatureItem` line the props carry) and one module holding every class string both
    renderers read.
  - `@asheeui/web` points its pricing card at those shared modules and its own styles file is
    removed. The rendered markup and the public props are unchanged.
  - The parity queue drops from 11 to 10: 48 of the 58 components the matrix promises for
    native are implemented.
- 232e1b5: Native gains `RowList`, the platform's rendering of the `Table` and `DataTable` contracts,
  and both contracts are stated once in `@asheeui/core`.
  
  - `@asheeui/native` reads a collection the way a phone does: one surface per row, and one
    labelled line per column, so a reader hears what each value means rather than a sequence of
    values. A table is not a native reading pattern — columns cannot be laid out side by side
    and read as a row on a phone — which is why the two contracts land on one component.
  - It renders the data table's furniture at the same time, through the framework's own
    components: a heading, a search field when the list knows what to search, the rows, an
    empty presentation when nothing matches, a count of what is showing (a live region, so a
    reader who searches or pages is told), and the platform's own collection footer to move to
    the next page. A consumer that restyles one of those restyles the list.
  - A row a consumer can act on is a control that reports its press; a chosen row states the
    accent at full weight and is marked as chosen for assistive technology as well as for the
    eye. The web's double-press handler has no counterpart, because a phone has no
    double-click, so the list takes a single row press.
  - The table's variants resolve to the surface each row is drawn on — a defined surface for
    the variants that separate cells with an edge, the framework's tinted surface for the
    striped one, and no surface for the ghost one — and `headerClassName` names a row the
    platform does not draw, so it resolves through the contract and changes nothing here.
  - `@asheeui/core` gains the table contract (`components.table`, with the `ColumnDef` a column
    is described by) and the data-table contract (`components.datatable`), plus one module per
    contract holding the class strings both renderers read.
  - `@asheeui/web` points its table and its data table at those shared modules and their own
    styles files are removed. The rendered markup and the public props are unchanged.
  - The parity queue drops from 8 to 6: 52 of the 58 components the matrix promises for native
    are implemented, and the remaining six are the navigation furniture and the layout shells.
- Native gains the screen shell — `Navbar` (with its `TabBar`), `Sidebar`, `SidebarLayout`,
  `DocsLayout` and `AuthLayout` — and the five contracts those components state are defined once
  in `@asheeui/core`.
  
  - `@asheeui/native` builds them the way a screen is built rather than the way a document is, and
    each one records what the platform decided instead of imitating the web. A bar scrolls its row
    of destinations rather than opening the web's disclosure, because a browser's bar is a single
    line it cannot scroll sideways and a platform's is not, so `mobileOpen`, `onMobileOpenChange`
    and `mobileLabel` resolve through the shared contract and change nothing; the current
    destination is stated as the control's selected state where the web states `aria-current`. The
    module also publishes `TabBar`, the platform's own second half of a navigation. A sidebar
    collapses to a rail, its rows render through the framework's own `Link` so a consumer keeps its
    routing, and a collapsed row explains itself through the framework's native `Tooltip`, which the
    platform shows on a long press. `SidebarLayout` and `DocsLayout` are stacked screens: the shell
    asks `useBreakpoint` once and states the direction it means, places the column outside the
    consumer's scrolling region rather than pinning it, and a documentation page's three regions
    become three stacked sections, each headed with the name the web gives its landmark. `AuthLayout`
    is what fills the height the platform gives the screen, with the media column decided once by
    `useBreakpoint`. All five register their defaults with the native registry, so
    `components.sidebar` and its four siblings resolve through the same cascade as everything else.
  - `@asheeui/core` gains the five contracts — `components.sidebar`, `components.sidebarlayout`,
    `components.navbar`, `components.docslayout` and `components.authlayout`, including the shared
    description of an item, a destination and a region — and one module per component holding every
    class string both renderers compile, per platform, side by side.
  - `@asheeui/web` points the same five components at those shared modules. The rendered markup and
    the public props are unchanged.
  - The parity queue drops from 5 to 0: all 58 components the matrix promises for native are
    implemented, so `scripts/native-parity.json` holds no queued module. What the increment leaves
    is a published package waiting on a consumer's own screen rather than another component.
- ba4222d: Native gains `Spinner` and `Skeleton`, and the compatibility matrix gains an
  enforcer, so a component the matrix promises for native cannot go missing.
  
  - `@asheeui/native` implements the two components with its own mechanism rather
    than a web one with the browser removed. `Spinner` draws its ring from the
    theme's classes and rotates it with React Native's `Animated` on the native
    thread, because a platform activity indicator takes a colour *value* while the
    contract names a colour *role*: a control that cannot resolve the role would
    take the prop and ignore it. `Skeleton` mirrors the shared pulse contract and
    stays hidden from assistive technology unless it is labelled.
  - `@asheeui/core` gains the `spinner` and `skeleton` modules those two share with
    the web: the configuration both platforms agree on and the class strings each
    renderer compiles, native and web side by side. Both renderers read one source,
    so a change to either scale is one edit.
  - `@asheeui/web` points its spinner and skeleton at those shared class maps. The
    rendered markup and the public props are unchanged.
  - `scripts/check-native-parity.mjs` reads the compatibility matrix at its source
    and asks what `@asheeui/native` publishes, by following the package's re-exports
    from its entry point. It fails when a component the matrix promises for native
    is neither exported nor queued, when an exported component still sits in the
    queue, and when the queue names a module the matrix does not promise for native.
    The queue lives in `scripts/native-parity.json` and may only shrink: shipping a
    queued component fails the check until its entry is removed. `pnpm
    check:native-parity` runs it locally, `--list` prints the whole expectation
    table, and CI runs it on every change.
- 54d0ed8: Native gains the `Split` layout primitive, and the module it reads is stated once in
  `@asheeui/core`.
  
  - `@asheeui/native` renders two panes that stack while the window is narrow and sit side by
    side once it is wide enough. The web states the breakpoint as a variant prefix because a
    browser has media queries; the platform has none to imitate, so the component asks
    `useBreakpoint` what the window has reached and decides the direction, the division of the
    width and the edge the separator sits on from the answer. Both panes stay in the tree at
    every width, which is the same promise the web keeps by leaving them in the document.
  - `@asheeui/core` gains the split contract (`components.split`) and one module holding every
    class string both renderers read: the stacking, the alignment, the division of the width,
    the separator and the sticky treatment, per platform. `stickyEnd` is a shared option the
    platform has nothing to say about, because it has no scroll-linked positioning; it is stated
    as an empty class rather than dropped, so a screen configures one shell for both platforms.
  - `@asheeui/web` points its split at those shared modules. The rendered markup and the public
    props are unchanged.
  - The parity queue drops from 15 to 14: 44 of the 58 components the matrix promises for native
    are implemented, and the remaining fourteen are the shell, page-furniture and data families.
- 398ba4b: Native gains the `Testimonials` band, and the band's options are stated once in
  `@asheeui/core`.
  
  - `@asheeui/native` renders a heading and a responsive grid of attributed quotes, each in
    the framework's own `Card` and each credited through the framework's own `Avatar`, so the
    band inherits the framework's surfaces and the avatar's substitution API and initials
    fallback without the consumer doing anything. It composes the platform's `Section`,
    `Container` and `Grid`, so a band written for a browser is a band on a device.
  - What differs is where the attribution's meaning lives. The web renders each quote as a
    `figure` with its `figcaption` inside a list, so a browser announces a set of attributed
    quotations. The platform has no list and no figure, so the band keeps the words and the
    attribution in one surface and in that order — the words first, then who said them — which
    is the same promise stated the way the platform can keep it.
  - `@asheeui/core` gains the testimonials contract (`components.testimonials` and the
    `TestimonialItem` a quote is described by) and one module holding every class string both
    renderers read. The band options themselves come from the shared `section-block` vocabulary
    every band reads, so a testimonials band and a feature grid answer the same questions the
    same way.
  - `@asheeui/web` points its testimonials at those shared modules and its own styles file is
    removed. The rendered markup and the public props are unchanged.
  - The parity queue drops from 10 to 9: 49 of the 58 components the matrix promises for
    native are implemented.
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
