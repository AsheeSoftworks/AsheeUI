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

The native package has a component set, and it is now the whole matrix: every one
of the 58 components the compatibility matrix promises for native is implemented
and tested with the platform's own tooling, and `scripts/native-parity.json` holds
no queued module.

| Area | Delivered |
| --- | --- |
| Layout | `Container`, `Stack`, `HStack`, `VStack`, `Grid`, `Section`, `Centered`, `Split`, `Page` with `PageHeader`, `PageContent` and `PageFooter` |
| Components | `Button`, `Text`, `Card`, `Badge`, `Input`, `Chip`, `Avatar`, `Image`, `Clipboard`, `Marquee`, `Spinner`, `Skeleton` |
| The field family | `Textarea`, `SearchInput`, `PinInput`, `Switch`, `Radio` and `RadioGroup`, `Dropmenu`, `MultiSelect`, `Autocomplete`, `Form`, `Stepper`, `FileUpload`, `Calendar` |
| Feedback and state | `Alert`, `EmptyState`, `ErrorState`, `LoadingState`, and the `ToastProvider` with `useToast` |
| Navigation and disclosure | `Link`, `Tabs`, `Accordion`, `Carousel`, `Pagination` |
| The page shell | `Navbar` with its `TabBar`, `Sidebar`, `SidebarLayout`, `DocsLayout`, `AuthLayout` |
| A marketing page | `MarketingLayout`, `Hero`, `FeatureGrid`, `CTA`, `Footer`, `Testimonials`, `PricingCard` |
| Data display | `Table` and `DataTable`, both shipped as `RowList` |
| Overlays | `Modal`, `Drawer`, `Tooltip` |
| Responsive | `useBreakpoint`, and the pure `resolveBreakpoint` and `resolveGridColumns` |
| Configuration | Every component registers its defaults and resolves through the shared cascade |
| A composed page | `@asheeui/puck` renders a page the web editor composed, with the components above |

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

The feedback and state family arrived next, as one increment, for the same reason the field
family did: an `Alert`, an `EmptyState`, an `ErrorState` and a `LoadingState` are four
presentations of one question — what is this region telling the reader — and the
`ToastProvider` is the same question raised above the screen. Three things are shared
rather than restated:

- **How a message is announced.** The framework names two levels, and the platform has no
  `status` role, so `@asheeui/core` states the relation between the two vocabularies once
  (`NATIVE_ANNOUNCEMENT_LIVE_REGION` and `resolveNativeAnnouncementRole`), and an alert, a
  state and a toast all announce themselves through it. A failure interrupts on the
  platform because it interrupts on the web.
- **What a message looks like.** The treatments and colour roles a message surface can wear
  are one pair of maps (`NATIVE_MESSAGE_SURFACE_CLASS`, `NATIVE_MESSAGE_TEXT_CLASS`), read
  by the alert and by the toast, so retuning one retunes the other.
- **How long a queue waits.** The toast's default timeout and its queue depth are stated
  in `@asheeui/core` (`TOAST_FALLBACK_TIMEOUT_MS`, `TOAST_FALLBACK_MAX_TOASTS`), because
  they are decisions about a reader's attention rather than about a platform.

What the platform forces is drawn and recorded rather than quietly ignored. A decoration
is a character rather than a drawing, because this package ships no icon set and its other
components already draw their affordances from text. The toast stacks its messages in a
layer of its own and anchors them to the **bottom centre** by default, because the
platform's own snackbar cannot carry the title, the action or the dismissal the contract
names — the same argument that keeps the native spinner a themed ring rather than an
activity indicator. An `EmptyState` has no `as` prop, because the platform has one
container. And the technical detail of an `ErrorState` is opened from the component's own
state, because the platform has no `details` element and the detail is not application
state.

The rest is the framework's, read from the same place the web reads it: `resolveCascade`
for every option, `NATIVE_RADIUS_CLASS` for corners, `SPACE_MIN_HEIGHT_CLASS` for the room a
loading region claims, and one helper (`openDestination`) for the destination a configured
action describes.

The navigation and disclosure family followed, and it is the family where the platform's own
behaviour does most of the work. What is shared is the vocabulary and the scale: a link's
emphasis, underline and density, a tab's items and its active and inactive treatment, an
accordion's items and its treatments, a carousel's slides and its timing. What the platform
does with them is read from the platform rather than imitated:

- A link underlines itself while it is **pressed**, because there is no pointer to hover with,
  and it follows its destination through the platform's URL handler unless the consumer handles
  the press itself or names the component that should render the link — the same substitution
  API the web link offers.
- A tab bar **scrolls with the platform's scroll view** rather than with a wrapped overflow,
  and the bar is not an accessibility element of its own: a container that is one hides the
  controls inside it from a reader, so a native tab bar is a row of tabs, each carrying its
  role and whether it is selected.
- An accordion opens with the **platform's own layout animation** rather than with a measured
  height, and a closed panel is not drawn at all, which is what takes it out of the
  accessibility tree — the platform's answer to the web's `inert`.
- A carousel **pages** with the platform's scroll view, so a slide arrives where the screen is.
  That is also why `loop` wraps only the autoplay here: a scroll view that teleported its
  content back to the start would be lying about where the reader is. `pauseOnHover` becomes
  "pause while a thumb is on it", which is the same intent on a platform with no pointer.

Two things the family states that the web states differently on purpose: a treatment a
component has none for — a global default stated for a filled control — resolves to the
treatment the component documents, and a decoration is a character rather than a drawing,
because this package ships no icon set.

The overlays came last, and they are the family where the platform's own arrangements replace the
framework's. What is shared is what an overlay is: a modal's widths and positions, a drawer's
sizes and placements, a hint's treatments, colour roles, sizes, placements, arrow, offset and
delay — all of it read from `@asheeui/core`, so a consumer configures them once for both.

What is not shared is the panel itself, and the platform's answer is better than a copy of the
web's would be:

- A modal is the platform's **own modal presentation**, which takes the screen above everything
  else, keeps the reader inside it, and hands the framework the platform's way out — the back
  gesture or button — through the platform's own callback. That is what `closeOnEscape` names
  here. The surface takes its own presses, so pressing what a dialog holds never dismisses it.
- A drawer is a **sheet** rather than a panel at the side of the page, because a panel at the
  side of a phone has nowhere to be. A top or bottom placement is already the edge a sheet comes
  from and is kept; a side placement resolves to the sheet, which the shared class dictionaries
  state. The movement is the platform's slide, from the edge it was given.
- A tooltip is shown on a **long press**, because there is no pointer to rest on the trigger, and
  the same `delay` the web counts is the length of the platform's long press. It is placed
  against the platform's own measurement of its trigger, and the placement reads exactly as the
  web's does — a side placement resolving to the vertical direction it reads from, because a hint
  beside a control has nowhere to be on a screen a thumb is already holding. Because a control
  may claim the press for itself, the hint is also stated as the trigger's **accessibility hint**,
  so a reader using assistive technology is told it without having to find the gesture.

Two of the overlays name options the platform leaves out, and the modules say so: a portal and a
layer order are about where something sits in a document, and the platform has no document.

The shell came last, and it is the increment that closes the matrix. A `Navbar`, a `Sidebar` and
the three compositions that arrange them are the components a whole screen is built out of, so
what the platform decides about them is about a screen rather than about a document:

- A bar **scrolls its row of destinations** rather than opening a disclosure, because a browser's
  bar is a single line it cannot scroll sideways and a platform's is not. The disclosure's three
  options — `mobileOpen`, `onMobileOpenChange` and `mobileLabel` — resolve through the shared
  contract and change nothing, and where the web marks the current destination with `aria-current`
  the platform states the same fact as the control's selected state. The navbar module also
  publishes `TabBar`, the platform's own second half of a navigation: the same destinations and
  the same states, at the edge a thumb reaches, which the web needs no equivalent for because its
  links are already in the bar.
- A sidebar **collapses to a rail** exactly as it does on the web, and a collapsed row explains
  itself through the framework's native `Tooltip`, which the platform shows on a long press rather
  than while a pointer rests on it. A row is the framework's own `Link`, so a consumer keeps its
  routing. The width transition and the pointer cursor the web declares resolve through the shared
  contract and state nothing, because a class cannot promise movement or a cursor the platform
  does not have.
- `SidebarLayout` and `DocsLayout` are **stacked screens**. The shell asks `useBreakpoint` once
  and states the direction it means — stacked on a phone, and beside the content from `lg` — with
  the column placed outside the consumer's scrolling region, which is the platform's own way of
  keeping it in view, so `stickySidebar` and the contents' stickiness resolve and change nothing.
  A documentation page's three regions become three stacked sections in the order the web's own
  flow gives them at its narrow widths, each headed with the name the web gives its landmark,
  because a platform screen has no landmark vocabulary but does let a region be titled.
- `AuthLayout` is **what fills the height the platform gives the screen**: the form is centred in
  it, the media column is decided once by `useBreakpoint`, and nothing scrolls, because the
  keyboard and the reading order of a platform screen are the screen's own business.

The queue in `scripts/native-parity.json` is empty as a result: every component the
matrix classifies for native is implemented, so platform support is a stated fact
rather than something a developer discovers by trying, and nothing is left for a
later increment.

The native package is not published yet, on purpose: a package is published when a
consumer can build a real screen with it, and the component set is no longer what
decides that — the proof is a consumer application building and testing its own
screens against it. `@asheeui/core` and `@asheeui/web` are published and
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
| Shared API, separate implementation | The concept is shared and the platform behaviour differs, deliberately | `Modal` (platform modal), `Drawer` (bottom sheet), `Tooltip` (long press), `Tabs`, `Table` (rows, not a table), `DataTable` (a list), `Page` (screen with safe areas), `Pagination` (load more), `Split` (the platform's own split view), `FileUpload` (the document picker), `Calendar` (one surface at a time, and the time is stepped rather than typed), `SidebarLayout` and `DocsLayout` (a stacked screen), `Navbar` (a header with a tab bar) and `Sidebar` (the same list, collapsing to a rail) |
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
`RowList`, `toast` ships as `ToastProvider`), and `pending`, which is what is left to
implement. The queue is a ratchet and may only shrink: implementing a queued component
fails the check until its entry is removed, so it cannot quietly become a list of what
nobody got round to. It is empty now, and it stays in the file because the next
component added to the matrix either ships for both platforms or is recorded there. CI
runs the guard, so a component cannot ship for one platform alone by accident.

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

## A composed page

A page a web editor composed is rendered on a device by `@asheeui/puck`. The package
holds one set of block specs — the label a builder shows, the fields it fills in and the
value each block starts as — and two drawings for each block, so a page cannot mean one
thing in the editor and another on a screen:

```tsx
import { PuckPage } from "@asheeui/puck";

export function PublishedPage({ page }) {
  return <PuckPage data={page} />;
}
```

What the platform renders is the same component set documented above, reached through the
same provider. Two things are deliberately absent. There is no editor: composing is a web
concern, and the platform is where a composed page is shown. And the package imports
nothing from `@puckeditor/core`, which is what lets a native bundle reach it at all — the
editor is an optional peer the web half alone needs.

One arrangement differs and is stated rather than hidden. A two-column block offers a
ratio on the web, where a stylesheet expresses one; the platform resolves its own window
and offers whole column counts, so the block draws the framework's two columns once there
is room for them.

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
| Puck's *editor* | It is a web authoring concern, and a block editor for a device would be a different product |
| A framework-wide animation system | Motion belongs to the component that needs it, and a general layer would be speculation |
| The web's table, breadcrumb and resizable-split components | Their native equivalents are lists, a titled header and a platform split view |
| The web package's source | Sharing source would give one platform the other's behaviour, which is what this architecture exists to avoid |

---

Built with AI. See [Ashee Softworks](https://asheesoftworks.com).
