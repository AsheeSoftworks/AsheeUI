# Components

AsheeUI ships 61 components. Every one of them resolves its appearance through
the [configuration cascade](./configuration.md), composes with consumer
`className` for layout, and renders on the server without a browser.

The set is layered, so you can build at the level your page needs:

```text
primitive        Button, Input, Typography, Badge
        ↓
component        Modal, Tabs, Dropmenu, Calendar
        ↓
pattern          Card, EmptyState, DataTable, PricingCard
        ↓
layout           Container, Section, Stack, Grid, Centered, Split, Page
        ↓
composition      MarketingLayout, DocsLayout, SidebarLayout, AuthLayout
        ↓
page             Navbar, Hero, FeatureGrid, CTA, Footer
        ↓
Puck block       any of the above, through asheeui/puck
```

## Shared prop axes

Most components accept the same four axes, which is what makes a global
configuration able to restyle the whole framework.

| Prop | Values | Notes |
| --- | --- | --- |
| `variant` | `solid`, `faded`, `bordered`, `ghost`, `underlined` | Components that have no underline treatment resolve `underlined` to `bordered` |
| `color` | `primary`, `secondary`, `success`, `warning`, `danger`, and any colour you add | Resolved through the framework's colour engine, never a raw palette class |
| `size` | `sm`, `md`, `lg` | Density of the control |
| `radius` | `none`, `xs`, `sm`, `md`, `lg`, `xl`, `full` | Corner rounding |
| `className` | string | Appended last, so it wins over the framework's own classes |

Each component documents its own props with JSDoc, so the TypeScript types are
the reference: hovering a prop in the editor shows its purpose, its default and
an example.

## The components

### Inputs and controls

| Component | Purpose |
| --- | --- |
| `Input` | Text field with label, description and message |
| `PasswordInput` | Text field with a reveal control |
| `SearchInput` | Search field: a named search region, a clear control and a submit path |
| `Textarea` | Multi-line text field |
| `FileUpload` | Drop zone and file picker, with a size limit and a list of chosen files |
| `Dropmenu` | Select one option from a list |
| `MultiSelect` | Select several options from a list |
| `Autocomplete` | Text field with matching suggestions |
| `Calendar` | Date selection, with a month grid |
| `Switch` | On or off control |
| `Radio`, `RadioGroup` | One choice from a small set |
| `Chip` | Compact token, with an optional remove control |
| `Button` | Action control, with busy and disabled states |
| `Keyboard`, `OnScreenKeyboard` | On-screen keyboard for touch input |

### Data display

| Component | Purpose |
| --- | --- |
| `Table` | Tabular data |
| `DataTable` | Search, row count, paging, loading and empty states around a `Table` |
| `Badge` | Compact status or label |
| `Avatar` | Person or entity, with an initials fallback |
| `Skeleton` | Loading placeholder |
| `Spinner` | Loading indicator |
| `Card` | Grouped content surface |
| `Typography` | Text with a semantic role |

### Navigation

| Component | Purpose |
| --- | --- |
| `Link` | Anchor, with framework router substitution |
| `Breadcrumb` | Hierarchical trail |
| `Pagination` | Page navigation |
| `Stepper` | Progress through an ordered sequence of steps |
| `Tabs` | Switch between panels |
| `Sidebar` | Application navigation |
| `ResizableScreen` | Draggable split layout |

### Overlays and feedback

| Component | Purpose |
| --- | --- |
| `Modal` | Dialog over the page |
| `Drawer` | Panel from the page edge |
| `Tooltip` | Description on hover or focus |
| `ToastProvider` | Transient notifications, raised with `useToast` |
| `Alert` | Inline message or validation summary |
| `LoadingState` | A region whose content has not arrived, announced as a status |
| `ErrorState` | A failure, with a retry and the technical message behind a disclosure |
| `Accordion` | Expandable sections |
| `Carousel` | Sliding content |
| `Marquee` | Continuously scrolling content |
| `Form` | Native form element with framework styling |
| `Image` | Picture with ratio locking and framework image substitution |

### Layout

The layout components own structure and nothing else. Each one adds a real
layout behaviour (a maximum width, a rhythm, an axis, a breakpoint, a shell),
so they compose instead of wrapping.

| Component | Purpose |
| --- | --- |
| `Container` | Centred column with a maximum width and a responsive gutter |
| `Section` | Full-width band with vertical rhythm, a background and an optional container |
| `Stack`, `HStack`, `VStack` | One-axis layout with a token gap, alignment and wrapping |
| `Grid` | Column grid whose column count can change at `md` and `lg` |
| `Centered` | One block in the middle of the space it is given |
| `Split` | Two panes that stack on a narrow screen and sit side by side above a breakpoint |
| `Page`, `PageHeader`, `PageContent`, `PageFooter` | The application page shell: sticky header, `main`, footer |

### Compositions

A composition arranges whole pages from the layers below it. It owns the page's
landmarks and nothing about its content.

| Component | Purpose |
| --- | --- |
| `MarketingLayout` | Navigation, a `main` region of sections, a footer and a skip link |
| `DocsLayout` | A navigation column, an article and an optional table of contents |
| `SidebarLayout` | A header, a persistent navigation column and a content column |
| `AuthLayout` | Authentication page shell, with an optional media column |

[Layouts](./layouts.md) documents the layer in full, with a worked example of
each composition.

The layout components never couple to a router, to application state or to a
particular product. `PageContent` is the one `main` landmark of a page, and the
shells stack their regions on a narrow screen rather than hiding them.

### Patterns

A pattern is a reusable combination of components that is still free of any
application's content.

| Component | Purpose |
| --- | --- |
| `EmptyState` | A region with nothing in it, worded by the consumer |
| `PricingCard` | One plan, its price, its feature lines and its actions |
| `Testimonials` | A band of attributed customer quotes |
| `CopyButton`, `Clipboard` | Copy a value, with the copied state and an announcement |

A configured action describes a destination, so an action that runs a handler is
passed to a pattern as a child (`EmptyState` also takes `actions` for that, which
renders it inside the pattern's own action group). The two forms are not
interchangeable, and the rule keeps a pattern's props serializable for a visual
editor.

### Pages and marketing sections

| Component | Purpose |
| --- | --- |
| `Navbar` | Header with a brand, links, actions and a mobile disclosure |
| `Hero` | The leading statement of a page |
| `FeatureGrid` | A heading and a responsive grid of feature cards |
| `CTA` | The closing call to action |
| `Footer` | Brand column, navigation groups, social and legal links |
| `PinInput` | One box per character of a verification code |

Every one of these takes its actions as configuration:

```tsx
<Hero
  eyebrow="Everything in one place"
  title="Run your campaigns from a single workspace"
  primaryAction={{ label: "Start free", href: "/signup" }}
  secondaryAction={{ label: "Book a demo", href: "/demo", variant: "ghost" }}
  media={<Image src="/dashboard.png" alt="The campaign dashboard" />}
/>
```

An action is `{ label, href, variant, color, size, radius, icon, component,
componentProps }`, which is the same set of choices a `Button` takes. Icons,
custom link components and handlers stay in React rather than in configuration,
which is what keeps the same props usable as a Puck field set.

## The substitution API

`Link`, `Image` and `Form` each render a native element that a framework
usually replaces. All three take the same two props, so one pattern covers them:

```tsx
import NextLink from "next/link";
import NextImage from "next/image";

<Link href="/invoices" component={NextLink} componentProps={{ prefetch: true }}>
  Invoices
</Link>

<Image src="/logo.png" alt="Logo" component={NextImage} componentProps={{ priority: true }} />
```

| Prop | Meaning |
| --- | --- |
| `component` | The component that replaces the native element. Defaults to the native element. |
| `componentProps` | Props for that component. They take precedence over the props the framework passes itself. |

Components that render one of the three forward the same pair for the element
they compose: a `Breadcrumb` step accepts `component` and `componentProps` for
its link, and `Avatar` and `Card` accept them for their picture.

## Field components

The field components (`Input`, `Textarea`, `Dropmenu`, `MultiSelect`,
`Autocomplete`, `Radio`, `Switch`) share one field contract:

| Prop | Behaviour |
| --- | --- |
| `label` | Names the control, and points at the element that owns the value |
| `labelAlign` | `left`, `center` or `right` |
| `description` | Linked to the control as its description |
| `message` | Linked to the control as its validation message |
| `status` | `default`, `error`, `warning` or `success`; selects the colour of the message |
| `required` | Marks the control required, visibly and to assistive technology |
| `isLoading` | Shows a pending state on the control |

Native attributes (`disabled`, `readOnly`, `placeholder`, `name`, `value`,
`defaultValue`, `onChange`, `onBlur`) pass straight through, so a field works
with a plain form and with a form library.

## Contexts that read the theme

`useTheme` reads and changes the theme, and `useToast` raises a notification
from anywhere inside the provider:

```tsx
const { success } = useToast();

success("The invoice was updated.");
```

`useToast` also returns `toast` for a fully specified notification, the
`error`, `info` and `warning` helpers alongside `success`, and `removeToast`
and `clearToasts` for dismissing one or all of them.

## Recipes

Some screens are a composition of what the framework already ships, and a
component of their own would duplicate one of the parts.

### A command palette

A command palette is a modal that searches a list and closes when a command runs.
The framework's parts are the modal, the search field and the list:

```tsx
const [query, setQuery] = useState("");
const [open, setOpen] = useState(false);

<Modal isOpen={open} onClose={() => setOpen(false)} title="Commands" size="sm">
  <VStack gap="sm">
    <SearchInput
      placeholder="Search commands"
      shortcut="Cmd K"
      onValueChange={setQuery}
    />
    <Sidebar
      items={commands.filter((command) => matches(command, query))}
      onSelect={(key) => {
        run(key);
        setOpen(false);
      }}
    />
  </VStack>
</Modal>;
```

`Modal` supplies the focus trap, the dismissal and the escape key, `SearchInput`
supplies the named search region and the query, and the list supplies the
keyboard navigation. A dedicated component would have to re-implement all three.

### A table page

`DataTable` is the recipe, and the parts stay reachable: pass a `toolbar` for
filters, `searchAccessor` for client-side search, or `onSearchChange` to search on
the server and replace the rows.

## Next

- [Accessibility](./accessibility.md) for keyboard behaviour and the announced state.
- [Puck](./puck.md) for the same components in a visual builder.
- [CLI](./cli.md) for listing the components a version exports.

---

Built with AI, using the process described in [How AsheeUI is built](published-process.md).
