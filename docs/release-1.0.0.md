# AsheeUI 1.0.0

An upgrade guide from `0.7.0`, the previous published version.

## What this release is

`1.0.0` freezes the public API. From here on, a breaking change follows the
[deprecation policy](./migration.md): an API is deprecated for at least one minor
release before it is removed, and removal happens only in a major release.

## What a `0.7.0` consumer is upgrading across

`0.8.0` was versioned internally but **never published**, and the `0.9.x` release
stage the plan described was folded into `1.0.0`. The registry goes from `0.7.0`
straight to `1.0.0`, so everything recorded for `0.8.0` and `1.0.0` is new to you.

| Package | From | To |
| --- | --- | --- |
| `asheeui` | `0.7.0` | **`1.0.0`** |
| `@asheeui/cli` | `0.6.7` | **`0.6.9`** |

## Requirements

| Requirement | Version |
| --- | --- |
| React | 18.2 or newer, or 19 |
| React DOM | the same major as React |
| Tailwind CSS | 4.0 or newer |

Nothing else changed: no bundler plugin, no build-time configuration file, and
the CLI remains optional.

## Upgrading

```bash
pnpm add asheeui@1.0.0
```

Then apply the changes below, run your test suite, and if the stylesheet import,
the provider or the configuration keys are involved, check the setup with
`npx asheeui doctor`.

## Changes that break a build

Three kinds of change produce a compile error, and each is mechanical.

### Renamed components

`Select` is now `Dropmenu`, `DatePicker` is now `Calendar`, and `TextArea` is now
`Textarea`. The old names are gone and there is no alias.

| Before | After | Also rename |
| --- | --- | --- |
| `Select`, `SelectProps` | `Dropmenu`, `DropmenuProps` | `components.select` becomes `components.dropmenu` |
| `DatePicker`, `DatePickerProps` | `Calendar`, `CalendarProps` | `components.datePicker` becomes `components.calendar`, and its `datePicker` sub-keys become `calendar` |
| `TextArea`, `TextAreaProps` | `Textarea`, `TextareaProps` | `components.textarea` is unchanged |

### One substitution API instead of four names

`Link`, `Image` and `Form` now take the same two props: `component` names the
component that replaces the native element, and `componentProps` carries its
props.

| Before | After |
| --- | --- |
| `Link`: `linkComponent`, `linkProps` | `component`, `componentProps` |
| `Image`: `props` | `componentProps` (`component` unchanged) |
| `Avatar`: `imageProps` | `componentProps` (`component` unchanged) |
| `Breadcrumb` step: `linkComponent`, `linkProps` | `component`, `componentProps` |
| `Card` image and link configuration: `props` | `componentProps` (`component` unchanged) |
| `Form` | New: it now accepts `component` and `componentProps` too |

### Internal helpers no longer exported

These were never documented as public API, and every other component keeps its
equivalent private. Import them from their module path in this repository if you
truly need them, or stop importing them.

| Removed from `asheeui` |
| --- |
| `FieldShell` and the field helper exports |
| `MenuOption` |
| `getInitials` (avatar) |
| `getPaginationRange`, `PaginationRangeItem` (pagination) |
| `RadioContext`, `RadioContextValue`, `useRadioGroupContext` |

## Behaviour changes to expect

These need no code change, but they change what a consumer sees. Two of them can
surface a latent configuration mistake, so read those first.

### Configuration is now validated

A value the framework cannot resolve **throws while the provider renders**,
naming the key and the value, instead of silently falling back. An unknown key
warns in development and is silent in production. If your configuration contains
a typo or a value that stopped being valid, this release is where you find out.

### The built-in defaults changed

The default radius is `xs` and the default variant is `faded`, where they used to
be `md` and `solid`. Pass the old values in your configuration to keep the
previous look:

```tsx
<AsheeUIProvider config={{ defaultRadius: "md", defaultVariant: "solid" }}>
```

### A stored theme the configuration does not define is ignored

If `localStorage` holds a theme name your configuration does not define, the
framework now falls back to your default instead of applying a theme class with
no CSS behind it.

### Dialogs render in a portal and manage focus

`Modal` and `Drawer` render into a portal rather than inside your subtree, move
focus in when they open, keep it inside, and return it when they close. Body
scroll is locked while one is open.

Consequences to check in your own code: a CSS selector or a query that assumed the
dialog lived inside a particular parent no longer matches, the backdrop is
decoration rather than a focusable control, and the dialog takes its accessible
name from the `aria-label` or `aria-labelledby` you pass.

### The selection family is a listbox with full keyboard support

`Dropmenu`, `MultiSelect` and `Autocomplete` expose their list as a listbox of
options with selection and disabled state, and they are operable from the
keyboard: arrow keys open and move, Home and End jump to the edges, Enter
selects, Escape dismisses, typing matches an option, and focus returns to the
trigger. An uncontrolled `MultiSelect` accumulates its own selection, and the
trigger reports that it accepts more than one.

### The calendar is a grid of labelled days

`Calendar` exposes a grid with labelled cells, the selected day, today and the
day the keyboard is on. Arrow keys move by day and week, PageUp and PageDown move
by month, and Escape closes the popover.

### Structure and motion

| Component | Change |
| --- | --- |
| `Accordion` | A collapsed panel is inert and hidden from assistive technology, so its content is no longer focusable or announced |
| `Sidebar` | The active item carries `aria-current`, and an uncontrolled sidebar follows its own collapsed state |
| `Switch` | Its description is linked to the control |
| `Radio` group | The group is named by its label, links its description and message, and selects an uncontrolled `defaultValue` |
| `Marquee`, `Carousel` | Automatic motion stops when the operating system asks for reduced motion |
| `Toast` | A notification carries a status role, so it is announced when it appears |
| `Button` | A busy control keeps its label in its accessible name |

### Theming

The theme CSS variables are now applied on a client-only render as well, so a
client-rendered application gets themed colours before the first paint instead of
rendering them unresolved. A server-rendered application is unchanged.

The structural scrollbar configuration also takes effect now.
`components.scrollbar` (`width`, `radius`, `trackRadius`, `thumbBorder`,
`gutter`) was previously ignored, because the stylesheet read variables that
nothing emitted.

## New components and the typography system

Seven components and the typography system are new since `0.7.0`, which brings the
public surface to **34 components**. Deferred to after 1.0: `Progress`, `Popover`,
`Separator` and `Alert Dialog`.

| Added | What it is |
| --- | --- |
| `Typography` | Text with a semantic role, plus shared typography tokens |
| `Alert` | Inline message or validation summary, with an announcement role per intent |
| `Badge` | Compact status or label |
| `Skeleton` | Loading placeholder |
| `Avatar` | Person or entity, with an initials fallback |
| `Breadcrumb` | Hierarchical navigation trail |
| `Pagination` | Page navigation |
| `Form` | Native form element with framework styling and a submit control |

Every addition renders on the server and hydrates without a mismatch, which a test
per component proves.

## The CLI

`@asheeui/cli` moved from `0.6.7` to `0.6.9` and is not required by anything
above. Two things changed:

- `asheeui list` derives the inventory from the package's public export surface,
  so an internal helper can no longer appear in it;
- the generated `asheeui.config.*` file is valid in both languages and exports the
  configuration object as the module's default export, which is what the provider
  wiring it writes imports. `doctor` no longer reports a missing configuration
  file as a failure, because the file is optional.

`doctor` and `fix` exit with code `1` while something is still broken, so either
can gate a script or a CI job.

## After upgrading

1. Apply the rename, substitution and export changes above.
2. Run your test suite.
3. Run `npx asheeui doctor` to confirm the stylesheet import, the provider and the
   dependencies.
4. Check anything that asserted on dialog markup, because dialogs moved into a
   portal.
5. If your theme comes from `localStorage` with custom theme names, confirm the
   names are the ones your configuration defines.

## Further reading

| Document | Covers |
| --- | --- |
| [Migration](./migration.md) | The deprecation policy and every breaking change with its migration |
| [Installation](./installation.md) | Requirements, the stylesheet import, wrapping the root |
| [Configuration](./configuration.md) | The cascade, the theme system, validation |
| [Components](./components.md) | The component set, the prop axes, the substitution API |
| [Accessibility](./accessibility.md) | The conformance target and the keyboard behaviour |
| [CLI](./cli.md) | The optional commands |
