# Release 1.1.0

This release turns AsheeUI from a component library into a framework that can
build a whole page: a layout system, the patterns a page is made of, and a Puck
integration that lets the same components be composed visually.

Nothing in the 1.0 API changed. Everything below is an addition, and an
application on 1.0 can upgrade by installing the version.

## What you can do now

```text
primitive        Button, Input, Typography
        ↓
component        Modal, Tabs, Dropmenu
        ↓
pattern          EmptyState, PricingCard, Testimonials
        ↓
layout           Container, Section, Stack, Grid, Page
        ↓
page             Navbar, Hero, FeatureGrid, CTA, Footer
        ↓
Puck block       the same components, in a visual builder
```

## The layout system

Seven modules own structure and nothing else. None of them couples to a router,
to application state or to a product.

```tsx
<Page>
  <PageHeader>
    <Typography role="heading-md">Invoices</Typography>
  </PageHeader>
  <PageContent>
    <Grid columns={1} columnsMd={2} columnsLg={3} gap="lg">
      <Card title="Inbox" description="12 unread" />
    </Grid>
  </PageContent>
  <PageFooter>Version 1.1.0</PageFooter>
</Page>
```

| Module | Adds |
| --- | --- |
| `Container` | A maximum width, a responsive gutter, centring |
| `Section` | Vertical rhythm, a background, an optional container, an optional separator |
| `Stack`, `HStack`, `VStack` | One axis, a token gap, alignment, justification, wrapping |
| `Grid` | A column count per breakpoint |
| `Page`, `PageHeader`, `PageContent`, `PageFooter` | The application shell, with one `main` landmark |
| `SidebarLayout` | A persistent navigation column that becomes a stacked region on a phone |
| `AuthLayout` | A centred form page with an optional media column |

The spacing scale behind them is shared (`Space`: `none`, `xs`, `sm`, `md`,
`lg`, `xl`, `2xl`), so a gap in a stack, a gap in a grid and the rhythm of a
section all speak the same language.

## The page components

`Navbar`, `Hero`, `FeatureGrid`, `CTA`, `Testimonials`, `PricingCard` and
`Footer` are the sections a marketing page is assembled from. They take their
actions as configuration, which is what makes them usable as builder blocks:

```tsx
<Hero
  eyebrow="Everything in one place"
  title="Run your campaigns from a single workspace"
  primaryAction={{ label: "Start free", href: "/signup" }}
  media={<Image src="/dashboard.png" alt="The campaign dashboard" />}
/>
```

`EmptyState` covers the empty, no-results and failed presentations of a region,
`PinInput` covers a verification code, and `CopyButton` with the headless
`Clipboard` covers copying a value and announcing the result.

## Puck

```bash
npm install asheeui @puckeditor/core
```

```tsx
import { Puck } from "@puckeditor/core";
import { asheePuckConfig } from "asheeui/puck";
import "asheeui/styles";
import "@puckeditor/core/puck.css";

export function Editor() {
  return <Puck config={asheePuckConfig} data={savedPage} onPublish={save} />;
}
```

The integration is a registry, not a second component set: each block is the
framework component plus the fields a builder can own. A published page renders
through Puck's own `Render`, so the editor and the live page are the same
components. See [Puck](./puck.md) for the blocks, the configuration boundary and
what is deliberately not included.

`@puckeditor/core` is an optional peer dependency: an application that never
imports `asheeui/puck` never installs it and never loads it.

## What is verified

- 51 public components, all of them render on the server and hydrate without a
  mismatch, including in a DOM-free environment.
- The Puck configuration is checked as configuration: every block renders, every
  field is a field type the builder knows, every category names real blocks, and
  every default value survives a JSON round trip.
- A published page is rendered through Puck's own renderer in the test suite.
- The end-to-end gallery and the three playground applications cover the
  additions on Vite, Next.js and TanStack Start.

## Deferred

Recorded rather than dropped:

| Deferred | Why |
| --- | --- |
| `DataTable`, `CommandMenu`, `FileUpload`, `Stepper`, `SearchInput` | Each is a substantial component in its own right, and none is required to make the layout and Puck model coherent. They are tracked as the next additions. |
| `LoadingState` and `ErrorState` as separate components | `Skeleton` and `Spinner` cover loading, and `EmptyState` with its `type` covers a failed region. Two more components would restate one presentation. |
| An off-canvas mobile sidebar | Needs a focus trap and a way back; belongs in a deliberate component rather than a layout. |
| Form blocks in Puck | A form block without a submission target is a field set with nowhere to go. |
| A prerender helper for built pages | The rendering path is Puck's `Render`; how a page is served is the host's decision. |

## Next

- [Components](./components.md) for the component set and the substitution API.
- [Configuration](./configuration.md) for the cascade and the new keys.
- [Puck](./puck.md) for the visual builder integration.
- [Migration](./migration.md) for the policy and the per-version record.

---

Built with AI. See [Ashee Softworks](https://asheesoftworks.com).
