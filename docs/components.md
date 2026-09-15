# Components

AsheeUI ships 34 components. Every one of them resolves its appearance through
the [configuration cascade](./configuration.md), composes with consumer
`className` for layout, and renders on the server without a browser.

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
| `Textarea` | Multi-line text field |
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
| `Accordion` | Expandable sections |
| `Carousel` | Sliding content |
| `Marquee` | Continuously scrolling content |
| `Form` | Native form element with framework styling |
| `Image` | Picture with ratio locking and framework image substitution |

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

## Next

- [Accessibility](./accessibility.md) for keyboard behaviour and the announced state.
- [CLI](./cli.md) for listing the components a version exports.
