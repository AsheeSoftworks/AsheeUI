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

The native package is in foundation: the shared layer, the provider, the
configuration cascade and the first component (the native `Button`) are implemented
and tested with the platform's own tooling. The remaining components, layout,
responsiveness and accessibility work is planned and tracked in the roadmap.

The native and shared packages are not published yet, on purpose: a package that
cannot yet build a real screen is not a package a consumer should install. The
publication happens when the priority component set is complete.

## Platform support, per component

The compatibility matrix is data, and every public component has exactly one
classification:

| Classification | Meaning | Examples |
| --- | --- | --- |
| Shared | One contract, a real implementation on both platforms | `Button`, `Card`, `Badge`, `Avatar`, `Input`, `Textarea`, `Switch`, `Chip`, `Spinner`, `Skeleton`, `PinInput`, `Form`, `Radio`, `Stack`, `Section`, `EmptyState`, `Alert` |
| Shared API, separate implementation | The concept is shared and the platform behaviour differs, deliberately | `Modal` (platform modal), `Drawer` (bottom sheet), `Tooltip` (long press), `Tabs`, `Table` (rows, not a table), `Page` (screen with safe areas), `Pagination` (load more) |
| Web only | The concept has no meaningful native equivalent | `Breadcrumb` (native uses a titled header), `ResizableScreen` (a desktop idiom) |
| Not applicable | The component compensates for a browser constraint the platform solves itself | `Keyboard` (the platform has one) |

The matrix is enforced by a test, so a component cannot be added to the framework
without a platform decision being recorded for it.


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
