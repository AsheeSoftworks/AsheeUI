# React Native

AsheeUI ships for React Native as well as the web. The native package is
`@asheeui/native`, styled with NativeWind, and it shares the framework's component
vocabulary, prop contracts and design language with the web implementation without
sharing its source.

The rule behind the whole platform story is simple: **the contract is shared, the
implementation is the platform's.** A native button is a native button, not a web
button with the browser removed.

## What is shared, and what is not

| Layer | Lives in | Shared? |
| --- | --- | --- |
| Component names and prop contracts | `@asheeui/core` | Yes |
| Design language (spacing, radius, typography, colour roles, elevation, breakpoints, touch target) | `@asheeui/core` | Yes |
| The four-tier configuration cascade | `@asheeui/core` | Yes |
| Compatibility matrix (what each component means on each platform) | `@asheeui/core` | Yes |
| Component implementation | `@asheeui/web` (web), `@asheeui/native` | No, by design |
| Styling technology | Tailwind classes (web), NativeWind classes (native) | No |

Sharing the source would mean one of the two platforms gets the other's behaviour.
Sharing the contract means a developer learns one component list and one set of prop
names, and each platform behaves the way its users expect.

## Status

The native package has a component set. The shared layer, the provider, the
configuration cascade, the layout kit and the components listed here are
implemented and tested with the platform's own tooling.

| Area | Delivered |
| --- | --- |
| Layout | `Container`, `Stack`, `HStack`, `VStack`, `Grid`, `Section`, `Centered` |
| Components | `Button`, `Text`, `Card`, `Badge`, `Input`, `Spinner`, `Skeleton` |
| The field family | `Textarea`, `SearchInput`, `PinInput`, `Switch`, `Radio` and `RadioGroup`, `Dropmenu`, `MultiSelect`, `Autocomplete`, `Form`, `Stepper`, `FileUpload`, `Calendar` |
| Responsive | `useBreakpoint`, and the pure `resolveBreakpoint` and `resolveGridColumns` |
| Configuration | Every component registers its defaults and resolves through the shared cascade |

The field family arrived as one increment rather than one component at a time, because
its members are the same shape: they read the family's vocabulary from `@asheeui/core`
(`FieldConfig`, the field class dictionaries and the two rules the family states once),
they draw the same label block through `FieldShell`, and they resolve the same cascade.
What each one adds is its own control and its own configuration section.

Two of the family's members read the platform rather than a preference, and both are
recorded in the matrix as shared API rather than hidden:

- A code field types into **one** field behind its boxes, because a native control has a
  single caret; the boxes draw what the field holds. The rules are unchanged: `PinInput`
  reads `sanitizePinValue` from `@asheeui/core`, so a web field and a native field filter
  the same input the same way.
- An autocomplete shows its suggestions **under** the field rather than floating them
  beside it, because a reader comparing what they typed with what it matches has to see
  both at once.

`Calendar` closes the family. It collects a date, a time or both, and what the platform
forces is drawn and recorded rather than quietly ignored: the field opens its calendar on
**one surface at a time**, because the platform has no floating layer for a panel beside a
control, and the time is **stepped** through columns rather than picked from a platform
clock, because a platform time picker takes a colour *value* while the contract names a
colour *role*, and a control that cannot resolve the role would accept the prop and ignore
it. What is not the platform's is the framework's, and it is read from `@asheeui/core`: the
month grid, the written form of a chosen date, the two rules that decide which cells a
reader may reach (`isFutureDay` and `canGoToNextMonth`), and the vocabulary that says what
an empty field collects. A day the web refuses is a day native refuses.

The components the matrix classifies but this release does not implement are
listed at the end of this document *and* queued in `scripts/native-parity.json`, so
platform support is a stated fact rather than something a developer discovers by
trying.

The native package is not published yet, on purpose: a package is published when a
consumer can build a real screen with it, and the remaining components in the matrix
decide when that is. `@asheeui/core` and `@asheeui/web` are published and
unaffected: their version lines, their tests and their public APIs are their own.

Publishing it is therefore an increment rather than a switch, and what the increment
adds is a released range in place of the `workspace:` one and a changeset: the
package already builds to `dist` with its declarations and already carries a
`publishConfig` whose entry points point at it. It publishes `@asheeui/core` first,
because it depends on it.

One rule holds meanwhile, and it is what keeps a consumer's install resolvable:
a published package may depend only on published packages. `@asheeui/web` depends on
`@asheeui/core` and on `@floating-ui/react`, `clsx` and `tailwind-merge`, and
`@asheeui/native` depends on `@asheeui/core` and on its peers, which is checked by
reading the manifest of the released tarball rather
than the one in the repository.

## Platform support, per component

The compatibility matrix is data, and every public component has exactly one
classification:

| Classification | Meaning | Examples |
| --- | --- | --- |
| Shared | One contract, and the platform implementation is the platform's | `Button`, `Text`, `Card`, `Badge`, `Input`, `Chip`, `Spinner`, `Skeleton`, `PinInput`, `Form`, `Radio`, `Switch`, `Stack`, `Section`, `Centered`, `Grid`, `EmptyState`, `Alert`, `LoadingState`, `ErrorState`, `SearchInput`, `Stepper` |
| Shared API, separate implementation | The concept is shared and the platform behaviour differs, deliberately | `Modal` (platform modal), `Drawer` (bottom sheet), `Tooltip` (long press), `Tabs`, `Table` (rows, not a table), `DataTable` (a list), `Page` (screen with safe areas), `Pagination` (load more), `Split` (the platform's own split view), `FileUpload` (the document picker), `Calendar` (one surface at a time, and the time is stepped rather than typed), `SidebarLayout` and `DocsLayout` (a stacked screen) |
| Web only | The concept has no meaningful native equivalent | `Breadcrumb` (native uses a titled header), `ResizableScreen` (a desktop idiom) |
| Not applicable | The component compensates for a browser constraint the platform solves itself | `Keyboard` (the platform has one) |

The matrix is enforced by a test, so a component cannot be added to the framework
without a platform decision being recorded for it.

## Keeping the components in step

A stored classification is a promise, and a promise that nothing checks decays. So
the matrix is also read by a guard:

```bash
pnpm check:native-parity          # verify, exit non-zero on drift
pnpm check:native-parity --list   # print the whole expectation table
```

The guard reads the matrix from its source — the moment an entry is written it is
seen — and it asks what `@asheeui/native` *publishes* rather than what its file names
suggest, by following the package's `export *` statements from its entry point. It
then fails in three cases:

- A component the matrix promises for native is neither exported nor queued.
- A component is exported but still sits in the queue.
- The queue names a module the matrix does not promise for native.

The queue itself is `scripts/native-parity.json`. It has two halves: `overrides`,
which names the native component where native publishes a different name from the
matrix's module (`typography` ships as `Text`, `table` and `data-table` ship as
`RowList`), and `pending`, which is what is left to implement. The queue is a
ratchet and may only shrink: implementing a queued component fails the check until
its entry is removed, so it cannot quietly become a list of what nobody got round to.
CI runs the guard, so a component cannot ship for one platform alone by accident.

## The layout kit and responsiveness

The portable half of the layout layer exists on native with the same props and
the same configuration cascade as the web:

| Primitive | What it decides natively |
| --- | --- |
| `Container` | A maximum width and a gutter, for a tablet or a desktop-sized window |
| `Section` | Vertical rhythm and a background band |
| `Stack`, `HStack`, `VStack` | One axis, a token gap, alignment, distribution and wrapping |
| `Grid` | A column count per breakpoint, resolved from the window |
| `Centered` | One block in the middle, on the axis you choose |

Responsiveness is a value rather than a class prefix, because the platform reports
the window rather than matching a media query:

```tsx
const { isAtLeast } = useBreakpoint();

<Stack direction={isAtLeast("md") ? "row" : "column"} gap="lg">
  <Card title="Inbox" description="12 unread" />
  <Card title="Sent" description="348 this month" />
</Stack>;
```

`Grid` uses the same vocabulary for its column count:

```tsx
<Grid columns={1} columnsMd={2} gap="lg">
  <Card title="Inbox" description="12 unread" />
  <Card title="Sent" description="348 this month" />
</Grid>;
```

Two rules keep this honest. The breakpoints are the shared ones, so `md` means
768 density-independent pixels on both platforms. And the inheritance rule is a
pure function (`resolveGridColumns`), tested at every breakpoint, so a count
stated at a smaller breakpoint carries to the larger ones exactly as it does on the
web.

The kit avoids responsive class prefixes on purpose. A prefix would depend on
NativeWind's breakpoints happening to agree with the framework's, and the
framework states its breakpoints as data, so a component reads them instead.


## Configuration

The native provider resolves configuration through the same cascade as the web
implementation: instance prop, then the component's configuration, then the platform
default, then the value the component documents.

```tsx
import { AsheeNativeProvider, Button } from "@asheeui/native";

export function App() {
  return (
    <AsheeNativeProvider
      config={{
        defaultRadius: "lg",
        components: { button: { size: "lg", fullWidth: true } },
      }}>
      <Button onPress={save}>Save invoice</Button>
    </AsheeNativeProvider>
  );
}
```

Rendering a framework component outside the provider throws rather than defaulting
silently, because a missing provider is a setup mistake and a silent default would
hide it.

## Setup

The native package expects the consuming application to provide React Native,
NativeWind and the platform's own toolchain. Adapt the application's own
configuration rather than replacing it:

1. Install the peer dependencies: `nativewind`, `react` and `react-native`.
2. Enable the NativeWind preset in the application's Babel and Metro configuration,
   as NativeWind documents.
3. Extend the Tailwind configuration with the theme colours the components reference
   (`primary`, `secondary`, `danger`, `warning`, `success`, `background`,
   `foreground`), so the semantic roles resolve to the application's palette.
4. Wrap the application root in `AsheeNativeProvider`.

## Development and testing

Each platform is tested with its own tooling, and neither suite pretends to be the
other:

| Platform | Runner | Why |
| --- | --- | --- |
| Web | Vitest and Testing Library, on a DOM | The web implementation's behaviour is DOM behaviour |
| Native | Jest with React Native's preset and the React Native Testing Library | The native implementation's behaviour is the platform's: roles, accessibility states, press interaction |

Two properties of the native test environment are worth knowing before writing a
native test:

- The React Native Testing Library is asynchronous: renders and events are awaited.
- Queries are about the platform's accessibility tree, so a component is found by its
  role and asserted through `accessibilityState` rather than through a DOM.

Run one platform's tests on its own:

```bash
pnpm --filter @asheeui/native test     # native
pnpm --filter @asheeui/web test             # web
pnpm --filter @asheeui/core test     # the shared layer
```

## Styling rules on native

NativeWind compiles the classes it can read in the source, exactly as Tailwind does
on the web. Two consequences follow, and both are non-negotiable in this codebase:

1. Every class is a complete, static string in a styles module. A class assembled at
   runtime produces no styling at all.
2. Density is a design-language decision rather than a per-component one. A control
   is at least as tall as the shared touch target, and `@asheeui/core` states and
   tests that value.

Animation follows the same rule, and `Spinner` is the case that sets it: the shared
layer states the duration and the classes, and the platform states the mechanism.
NativeWind cannot register a component that animates itself, so motion here is React
Native's `Animated` driven on the native thread (`useNativeDriver: true`) — the view
that moves carries nothing else, and the child inside it carries the classes, the
props and the accessibility. The ring is drawn from theme classes rather than from a
platform activity indicator, because a platform control takes a colour *value* while
the framework's contract names a colour *role*: a control that cannot resolve the role
would accept the prop and ignore it.

## Accessibility on native

Accessibility is a property of each component rather than a later addition:

- Components carry the platform's roles (`accessibilityRole`).
- State is announced through `accessibilityState`, so a disabled or busy control is
  reported as disabled or busy.
- Decorative elements inside a control are hidden from assistive technology, so the
  control keeps one stable accessible name.
- Touch targets respect the shared minimum; a control that misses it is a defect
  rather than a style choice.

## What is deliberately not here

| Not ported | Why |
| --- | --- |
| Puck (the page builder) | It is a web authoring concern; a native block editor would be a different product |
| A framework-wide animation system | Motion belongs to the component that needs it, and a general layer would be speculation |
| The web's table, breadcrumb and resizable-split components | Their native equivalents are lists, a titled header and a platform split view |
| The web package's source | Sharing source would give one platform the other's behaviour, which is what this architecture exists to avoid |
| `Alert`, `Sheet`, `Tabs`, `Avatar`, `Separator`, `EmptyState` | Decided and recorded in the matrix, but not implemented in the 2.0 release. Each is the next increment of the native component set, and none is blocked by an undecided contract. |

---

Built with AI. See [Ashee Softworks](https://asheesoftworks.com).
