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
| Component names and prop contracts | `@asheeui/shared` | Yes |
| Design language (spacing, radius, typography, colour roles, elevation, breakpoints, touch target) | `@asheeui/shared` | Yes |
| The four-tier configuration cascade | `@asheeui/shared` | Yes |
| Compatibility matrix (what each component means on each platform) | `@asheeui/shared` | Yes |
| Component implementation | `asheeui` (web), `@asheeui/native` | No, by design |
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
| Components | `Button`, `Text`, `Card`, `Badge`, `Input` |
| Responsive | `useBreakpoint`, and the pure `resolveBreakpoint` and `resolveGridColumns` |
| Configuration | Every component registers its defaults and resolves through the shared cascade |

The components the matrix classifies but this release does not implement are
listed at the end of this document, so platform support is a stated fact rather
than something a developer discovers by trying.

The native and shared packages are not published yet, on purpose: a package is
published when a consumer can build a real screen with it, and the remaining
components in the matrix decide when that is. The web package is published and
unaffected: its version line, its tests and its public API are its own.

Publishing them is therefore an increment rather than a switch, and the reason is
mechanical: both packages point their entry points at their TypeScript sources
(`main` is `src/index.ts`), which is what this workspace compiles and what a
published consumer could not; neither builds to a directory a package can ship; and
`@asheeui/native` depends on `@asheeui/shared` through a `workspace:` range that
exists only inside this repository. The increment that publishes them adds a build
with declarations, a `publishConfig` whose entry points point at it, a `files`
list, a released range in place of the workspace one, and a changeset — and it
publishes both together, because one depends on the other.

One rule holds meanwhile, and it is what keeps a consumer's install resolvable:
a published package may depend only on published packages. `asheeui` depends on
`@floating-ui/react`, `clsx` and `tailwind-merge` and on nothing from this
workspace, which is checked by reading the manifest of the released tarball rather
than the one in the repository.

## Platform support, per component

The compatibility matrix is data, and every public component has exactly one
classification:

| Classification | Meaning | Examples |
| --- | --- | --- |
| Shared | One contract, and the platform implementation is the platform's | `Button`, `Text`, `Card`, `Badge`, `Input`, `Chip`, `Spinner`, `Skeleton`, `PinInput`, `Form`, `Radio`, `Switch`, `Stack`, `Section`, `Centered`, `Grid`, `EmptyState`, `Alert`, `LoadingState`, `ErrorState`, `SearchInput`, `Stepper` |
| Shared API, separate implementation | The concept is shared and the platform behaviour differs, deliberately | `Modal` (platform modal), `Drawer` (bottom sheet), `Tooltip` (long press), `Tabs`, `Table` (rows, not a table), `DataTable` (a list), `Page` (screen with safe areas), `Pagination` (load more), `Split` (the platform's own split view), `FileUpload` (the document picker), `SidebarLayout` and `DocsLayout` (a stacked screen) |
| Web only | The concept has no meaningful native equivalent | `Breadcrumb` (native uses a titled header), `ResizableScreen` (a desktop idiom) |
| Not applicable | The component compensates for a browser constraint the platform solves itself | `Keyboard` (the platform has one) |

The matrix is enforced by a test, so a component cannot be added to the framework
without a platform decision being recorded for it.

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
pnpm --filter asheeui test             # web
pnpm --filter @asheeui/shared test     # the shared layer
```

## Styling rules on native

NativeWind compiles the classes it can read in the source, exactly as Tailwind does
on the web. Two consequences follow, and both are non-negotiable in this codebase:

1. Every class is a complete, static string in a styles module. A class assembled at
   runtime produces no styling at all.
2. Density is a design-language decision rather than a per-component one. A control
   is at least as tall as the shared touch target, and `@asheeui/shared` states and
   tests that value.

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
| `Switch`, `Alert`, `Sheet`, `Tabs`, `Avatar`, `Skeleton`, `Separator`, `EmptyState` | Decided and recorded in the matrix, but not implemented in the 2.0 release. Each is the next increment of the native component set, and none is blocked by an undecided contract. |
