# Puck

AsheeUI ships a Puck integration that lets the same components power a React
application, a visual editor and a published page. It lives behind its own
entry point, so an application that does not build pages never loads it.

```bash
npm install asheeui @puckeditor/core
```

`@puckeditor/core` is an optional peer dependency. It is only needed when you
import the integration.

## What the integration is

```text
AsheeUI component
        ↓
Puck configuration (fields + default props + render)
        ↓
block registry (asheePuckConfig)
        ↓
editor preview and published page
```

There are no `PuckHero`, `PuckNavbar` or `PuckFooter` components. Each block is
the framework component plus the configuration a builder can own, so a block
cannot drift away from the component an application renders.

## Usage

```tsx
import { Puck } from "@puckeditor/core";
import { asheePuckConfig } from "asheeui/puck";
import "@puckeditor/core/puck.css";
import "asheeui/styles";

export function Editor() {
  return (
    <Puck config={asheePuckConfig} data={savedPage} onPublish={save} />
  );
}
```

A published page renders through Puck's own renderer, which needs no editor:

```tsx
import { Render } from "@puckeditor/core";
import { asheePuckConfig } from "asheeui/puck";

export function PublishedPage({ page }) {
  return <Render config={asheePuckConfig} data={page} />;
}
```

Blocks resolve their theme through the framework provider. The configuration's
page shell supplies one when the page has none, and respects the one you
already have, so a `defaultTheme` or a component override in your own provider
keeps applying to a built page.

## Blocks

| Category | Blocks |
| --- | --- |
| Layout | `Section`, `Columns` |
| Navigation | `Navbar`, `Footer` |
| Hero | `Hero` |
| Content | `Heading`, `Text` |
| Features | `FeatureGrid` |
| CTA | `CTA` |
| Pricing | `PricingCard` |
| Testimonials | `Testimonials` |
| Utility | `EmptyState` |

The set is deliberately small and complete: every block is a component the
framework already documents, and the editor offers them with the fields that
component exposes.

## The configuration boundary

A block exposes its **visual configuration**, not its React API. The boundary is
the same for every block:

| In the configuration | Out of the configuration |
| --- | --- |
| Wording, alignment, spacing, background, columns | Icons and arbitrary React nodes |
| Destinations and action wording | Click handlers and functions |
| Repeatable content (features, quotes, links) | Data from an application, a database or a request |

Everything inside the configuration survives a JSON round trip, which is what a
saved page is. Nothing that cannot be serialized, and no runtime state, is put
into a field: a block that needed one would be a component problem rather than a
builder problem.

## Adding a block

A block is a small module. It states its props, its fields and how the props
reach the component:

```tsx
import type { ComponentConfig } from "@puckeditor/core";
import { Alert } from "asheeui";

type AlertBlockProps = {
  title: string;
  tone: "info" | "success" | "warning" | "error";
};

export const alertBlock: ComponentConfig<AlertBlockProps> = {
  label: "Notice",
  fields: {
    title: { type: "text", label: "Wording" },
    tone: {
      type: "select",
      label: "Tone",
      options: [
        { label: "Information", value: "info" },
        { label: "Warning", value: "warning" },
      ],
    },
  },
  defaultProps: { title: "A new version is available", tone: "info" },
  render: ({ title, tone }) => <Alert type={tone}>{title}</Alert>,
};
```

Add it to `components` and to a `categories` entry, and a test in the same
change. The integration's own test suite asserts that every block renders, that
every field is a field type the builder knows, that every category names real
blocks, and that every default value survives a JSON round trip.

## What is not included

| Not included | Why | Tracked as |
| --- | --- | --- |
| A prerender or static-site helper for built pages | The rendering path is Puck's `Render`; hosting decides how a page is served | Deferred until a product needs it |
| Form blocks (`Form`, `PinInput`) | A form block without a submission target is a field set with nowhere to go | Deferred until a product needs it |
| A `Columns` block with more than two columns | Two columns cover the marketing sections the framework ships; more shapes can be composed | Deferred |
| Off-canvas mobile navigation inside `SidebarLayout` | An off-canvas drawer needs a focus trap, which belongs in a deliberate component rather than in a layout | Deferred |

## Next

- [Components](./components.md) for the component set the blocks are built from.
- [Configuration](./configuration.md) for the cascade a block's props resolve through.
- [Release 1.1.0](./release-1.1.0.md) for what this release adds.
