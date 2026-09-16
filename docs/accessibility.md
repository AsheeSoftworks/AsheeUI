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
| `Navbar` | The control that opens the mobile panel reports its state with `aria-expanded` and points at the panel with `aria-controls`; Escape closes the panel and returns focus to the control |
| `PinInput` | Typing moves to the next box, Backspace clears the box behind the caret, the arrow keys move between boxes, and Home and End jump to the edges |

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
- A `Page` shell has one `main` landmark (`PageContent`), a `header` and a
  `footer`, and a `SidebarLayout` renders its navigation column in a named
  `aside`, so the regions of a page are navigable rather than anonymous.
- A `Navbar` is a `header` landmark that contains a named navigation landmark,
  and a `Footer` gives every navigation group, the legal row and the social row
  their own name, so a reader can jump to the column they want.
- A `Hero`, `CTA` or `FeatureGrid` band is a `section` and is named by the
  heading inside it, and the framework does not invent a heading for a band that
  has none.
- An excluded feature line in a `PricingCard` says so in words as well as in
  style, and a recommended plan carries a badge rather than relying on colour.
- A `CopyButton` announces the result through a status region, because a change
  of button label alone is not announced, and focus stays on the control.
- An `EmptyState` carries no live-region role of its own. A state that replaces
  content after an asynchronous result passes `role="status"` or
  `role="alert"`, so a change is announced and a state rendered with the page is
  not.

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
| Mobile navigation in a page shell | `SidebarLayout` stacks its navigation column above the content on a narrow screen instead of hiding it behind an off-canvas drawer. An off-canvas drawer needs a focus trap and a way back, which belongs in a deliberate component rather than in a layout. |
| Paste position in `PinInput` | The value is a dense code, so a paste into a box beyond the characters already filled lands at the end of them rather than leaving gaps. |

## Reporting an accessibility problem

Open an issue with the component, the assistive technology or browser, and what
you expected to happen. A reproduction that starts from one of the components in
this documentation is the fastest path to a fix.

---

Built with AI. See [Ashee Softworks](https://asheesoftworks.com).
