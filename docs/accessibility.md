# Accessibility

AsheeUI targets **WCAG 2.2 Level AA**. This page describes the behaviour the
framework guarantees, so a consumer can rely on it instead of re-implementing it.

## What the framework handles for you

| Guarantee | Behaviour |
| --- | --- |
| Accessible names | A field names its control, and a component that shows only an icon takes a label for assistive technology |
| Description and message | A field links its description and its validation message to the element that holds the value |
| Focus in dialogs | `Modal` and `Drawer` move focus into the dialog when it opens, keep it there while open, and return it to the element that was focused before |
| Overlays render in a portal | Dialogs, menus and tooltips escape overflow and stacking contexts, and the backdrop is decoration rather than an unnamed control |
| Body scroll | A dialog locks the page behind it through one reference-counted mechanism |
| State changes | A notification is announced; an alert at the `error` or `warning` intent interrupts, while `info` and `success` wait for a pause |
| Reduced motion | Automatic motion in `Marquee` and `Carousel` stops when the operating system asks for it |
| Focus movement | Components move focus only when the interaction requires it, and an inline message never steals it |

## Keyboard behaviour

| Component family | Keys |
| --- | --- |
| `Button`, `Link`, `Switch`, `Radio` | Tab reaches the control; Enter or Space activates it |
| `Dropmenu`, `MultiSelect`, `Autocomplete` | Arrow keys open the list and move between options, Home and End jump to the edges, Enter selects, Escape dismisses, typing matches an option, and focus returns to the trigger when the list closes |
| `Calendar` | Arrow keys move by day and by week, PageUp and PageDown move by month, Enter selects a day, Escape closes the popover |
| `Tabs` | Arrow keys move between tabs with a single tab stop, Home and End jump to the edges |
| `Accordion` | Enter or Space expands and collapses the section |
| `Modal`, `Drawer` | Escape dismisses; focus cannot leave the dialog while it is open |
| `Tooltip` | Appears on focus as well as on hover, and is exposed as the trigger's description |

Composite widgets (the selection family, the calendar, tabs, radio groups) use a
single tab stop with arrow navigation inside it, which is what the platform and
ARIA conventions ask for.

## Structure

- A `Breadcrumb` is a named navigation landmark over an ordered list, and the
  current location is text rather than a link.
- A `Pagination` marks the current page with `aria-current`, and its controls are
  real buttons or links.
- A `Table` renders table semantics, not a grid of divs.
- A collapsed `Accordion` panel is hidden from assistive technology and out of
  the tab order.
- A `Sidebar` exposes the active item with `aria-current` and follows its own
  collapsed state.
- A decorative element (a spinner, a skeleton, an icon beside a label) is hidden
  from assistive technology, and the information it stands for is announced by
  the element that carries it.

## Theming without a flash

The theme is applied before the first paint, so a consumer never sees the wrong
theme appear and then change. That is done with an inline script that runs while
the document is parsed, which means two things for a consumer:

- a server-rendered application gets the theme applied before any content
  paints;
- a client-only application has the theme and its colours applied by the
  provider before the first paint.

## Theme system

Theme colours are CSS custom properties (`--ashee-background`,
`--ashee-foreground`, `--ashee-primary`, and so on). Component styles read those
variables, so a theme change is a variable change rather than a stylesheet swap.

Forced-colors and high-contrast modes are respected because the framework never
hard-codes a palette colour: every colour resolves through the configuration.

## Known limits in this release

| Limit | Detail |
| --- | --- |
| Right-to-left layouts | Not supported in this release. The components assume a left-to-right writing direction. |
| Automated rule checks | The framework's own accessibility tests are behavioural and role based. No rule-based checker runs in the suite, so a consumer running one may see findings about their own markup. |
| Browser-dependent focus containment | Focus containment in a dialog and the absence of a collapsed panel from the tab order are implemented directly; a browser-based test is the only way to observe them, which the framework's DOM-based suite cannot do. |

## Reporting an accessibility problem

Open an issue with the component, the assistive technology or browser, and what
you expected to happen. A reproduction that starts from one of the components in
this documentation is the fastest path to a fix.
