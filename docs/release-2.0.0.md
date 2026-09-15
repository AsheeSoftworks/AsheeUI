# AsheeUI 2.0.0

| Field | Value |
| --- | --- |
| Version | `2.0.0` |
| Packages | `asheeui` `2.0.0`, `@asheeui/shared` `2.0.0`, `@asheeui/native` `2.0.0` |
| Previous release | `asheeui` `1.1.1` |
| Breaking changes for an existing application | None. Every addition is additive, and the two behaviour corrections are described below. |

AsheeUI 2.0.0 completes the transition from a component library into a UI system.
The component inventory grows from 51 to 61, the layout layer gains the two
primitives that were missing, four full-page compositions make a whole page
expressible without a second library, and the native package gains the component
set and the responsive vocabulary it was missing.

## What is new

### The layout layer is complete

| Component | What it does |
| --- | --- |
| `Centered` | Places one block in the middle of the space it is given, with the axis, the room it claims and an optional container as options |
| `Split` | Two panes that stack on a narrow screen and sit side by side from a chosen breakpoint, with a ratio, a divider and a sticky second pane |

Both resolve their options through the configuration cascade, use the shared
spacing scale, and never hide a pane: below the breakpoint the panes stack, so the
content stays in the document, reachable with the keyboard and read by a screen
reader in a sensible order.

### Four full-page compositions

| Composition | What it arranges |
| --- | --- |
| `MarketingLayout` | Navigation, one `main` landmark holding the sections, a footer, and a skip link as the first focusable element |
| `DocsLayout` | A navigation column, an article and an optional table of contents, with the contents hidden on a narrow screen rather than trapping focus in a drawer |
| `SidebarLayout` | The application shell: a header, a persistent navigation column and a content column, now with its header and footer spanning the page at every width |
| `AuthLayout` | The centred sign-in form, unchanged from 1.1 |

The dashboard composition is `SidebarLayout` with the framework's `Navbar`,
`Sidebar` and page parts; the marketing composition is `MarketingLayout` with
`Navbar`, `Hero`, `FeatureGrid`, `CTA` and `Footer`. See
[Layouts](./layouts.md) for the worked examples.

### Six components and patterns

| Component | What it is |
| --- | --- |
| `SearchInput` | A named search region and a named field, with a clear control that empties the field and returns focus to it, an optional shortcut hint, and a submit path through `onSearch` |
| `Stepper` | The reader's progress through an ordered list of steps, with `aria-current="step"`, each state stated in words as well as in colour, and a reachable step rendered as a control |
| `DataTable` | The table a list page is built from: search, a row count that is announced when it changes, pagination, a loading region and an empty presentation, all composed from components the framework already had |
| `FileUpload` | A drop zone that is a label for the field it hides, a size limit that reports what it left out, and the chosen files as removable chips |
| `LoadingState` | A region whose content has not arrived: a `status` region that says what is loading and claims room so the page does not jump |
| `ErrorState` | A region whose content could not be loaded: a labelled failure, an optional retry, and the technical message behind a disclosure |

`FileUpload` and `ErrorState` also gained the two things they needed one level
down: `Chip` takes a `closeLabel`, so a list of chips has one remove control per
chip with a name that says what it removes, and `EmptyState` takes `actions` for
actions that carry a React handler, because a configured action describes a
destination rather than a callback.

### The native package

The native package was a provider, a configuration cascade and one component. It
now has a component set and a layout kit:

| Area | Delivered |
| --- | --- |
| Layout | `Container`, `Stack`, `HStack`, `VStack`, `Grid`, `Section`, `Centered` |
| Components | `Text`, `Card`, `Badge`, `Input`, plus the `Button` it already had |
| Responsive | `useBreakpoint`, which reads the window, resolves it to the framework's breakpoints, and gives the grid its column count |
| Configuration | Every new component registers its defaults and resolves through the same cascade as the web package |

The responsive rule is deliberately platform-shaped: React Native reports the
window as a value, so a native component reads the breakpoint rather than
depending on responsive class variants, and `resolveGridColumns` is a pure
function whose inheritance rule is tested at every breakpoint. See
[React Native](./native.md) for what is shared, what is not, and what is still to
come.

### The playgrounds, and getting one

The playgrounds are the release's evidence that the system works where a consumer
uses it. They were separate applications each keeping its own copy of the same
screens; they are now **one application with a door per framework**:

| Property | How it holds |
| --- | --- |
| One application | The screens, the demonstration data, the interaction state, the provider and the contract every screen satisfies live in one place. A framework shell holds only its document, its routing and its platform adapters |
| Written in AsheeUI | No authored HTML and no utility classes: a page is `Container`, a band is `Section`, a group is `Stack`, `HStack` or `VStack`, a deck is `Grid`, a paragraph is `Typography` |
| Configured with nothing | The configuration is an empty object, so running a playground is the proof that the framework's own defaults are complete |
| Reachable from the CLI | `npx asheeui playground next ./invoices` creates a project that installs on its own and carries no repository-only code |

The distributed project is generated from the playgrounds in the repository rather
than maintained as a second copy, and a test requires every shipped file to be the
file that generator produces. See [Playgrounds](./playgrounds.md) for the boundary
between the application and a framework shell.

## Corrections in this release

| Correction | Why it matters |
| --- | --- |
| `SidebarLayout` no longer turns its whole shell into a row at the `lg` breakpoint | The shell is a column of a header, a two-column row and a footer. Before the correction the header and the footer became row items beside the columns, so a shell with a header laid out wrongly above 1024 pixels. The interfaces are unchanged; only the classes the shell renders are. |
| `EmptyState`'s documented example no longer passes a handler in a configured action | A configured action describes a destination, so the example's `onClick` would have been dropped silently. The example now shows the two supported forms. |
| `Chip`'s remove control takes its accessible name from `closeLabel` | A list of chips announced every remove control as "Remove chip", which does not say what is removed. The default is unchanged, so no existing usage changes. |

## Upgrading from 1.1.x

1. Update the dependency: `pnpm add asheeui@2.0.0` (or the equivalent in your
   package manager).
2. Nothing else is required. Every component, prop and configuration key from
   1.1.x is still supported, and the new configuration sections are optional.
3. If you use `SidebarLayout`, look at a page above 1024 pixels to confirm the
   header and footer now span the shell rather than sitting beside the columns.
   This is the correction described above, and it is the only visual change an
   existing application will see.

The [migration](./migration.md) guide records this release alongside every earlier
breaking change and its path.

## Deferred, and recorded rather than dropped

| Deferred | Why | Where it goes next |
| --- | --- | --- |
| A dedicated `CommandMenu` | `Modal` plus `Autocomplete` already compose one, and the arrangement is documented in [Components](./components.md). A second implementation would duplicate the first. | A component only if a real requirement appears |
| An off-canvas navigation drawer for the page compositions | Hiding navigation behind a drawer needs a focus trap and a way back, which is a component rather than a layout detail | The first consumer that needs it |
| Native `Switch`, `Alert`, `Sheet`, `Tabs`, `Avatar`, `Skeleton`, `Separator`, `EmptyState` | The native contract of each is decided and recorded in the compatibility matrix, but the implementations are not in this release | `ROAD-046` M18 continuation |
| An Expo playground | The native package is not published, and it does not yet carry every component the shared application renders, so a copied Expo project would promise something the framework cannot yet keep | The increment that ships the remaining native components, recorded in [React Native](./native.md) |
| Rebuilding the website | The website is a separate project that will be rebuilt from this architecture, not adapted to it | The website milestone |

## Validation

| Gate | Result |
| --- | --- |
| Web tests | 93 files, 678 tests, green |
| Shared tests | 16 tests, green, with the matrix covering the 61 component inventory |
| Native tests | 8 suites, 61 tests, green |
| CLI tests | 144 tests, green, with the inventory list matching the exported surface |
| Gallery and playgrounds | The gallery grew four sections for the new components (22 in total, 7 interactive), and the same contract passes in the gallery and in all three playground applications: Next.js, Vite and TanStack Start, on the server and again after hydration |
| Distribution | `asheeui playground` copies a project into a clean directory that depends on the published package alone: no `workspace:` range, no repository-only package and no build output. Every shipped file is asserted to be the file the generator produces from the playgrounds, and a copied project installs with the package as the registry serves it, runs its own tests and builds — verified on Vite, TanStack Start and Next.js |
| Build | The workspace builds: the library, the CLI and the three playground applications |
| Version | `2.0.0` in the workspace manifests, the shared package and the native package |

