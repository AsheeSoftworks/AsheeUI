# Puck

AsheeUI ships a Puck integration that lets the same components power a React
application, a visual editor and a published page. It is a package of its own,
`@asheeui/puck`, because it is used on both platforms: the web half is the editor's
block registry and the editor's page renderer, and the React Native half draws a
composed page with the native components.

```bash
npm install @asheeui/puck @puckeditor/core
```

`@puckeditor/core` is an optional peer dependency. It is needed by the web half
alone; the native half loads without it, which is what lets a device bundle reach
`@asheeui/puck` at all.

## What the integration is

```text
AsheeUI component
        ↓
block spec (label + fields + default value)      ← one, read by both platforms
        ↓
platform drawing (web registry, native registry)
        ↓
editor preview, published page, and a device
```

There are no `PuckHero`, `PuckNavbar` or `PuckFooter` components. Each block is
the framework component plus the configuration a builder can own, and the
configuration half is stated once — so a block cannot drift away from the
component an application renders, and a block added once is offered on both
platforms.

## Usage

```tsx
import { Puck } from "@puckeditor/core";
import { asheePuckConfig } from "@asheeui/puck";
import "@puckeditor/core/puck.css";
import "@asheeui/web/styles";

export function Editor() {
  return (
    <Puck config={asheePuckConfig} data={savedPage} onPublish={save} />
  );
}
```

A published page renders through `PuckPage`, which needs no editor — and, written
this way, renders on a device as well as in a browser:

```tsx
import { PuckPage } from "@asheeui/puck";

export function PublishedPage({ page }) {
  return <PuckPage data={page} />;
}
```

On the web `PuckPage` renders through Puck's own `Render`, so a live site and the
editor's preview are the same components. Under Expo and Metro the same import
resolves to the native half, which walks the stored document and draws each block
with `@asheeui/native` — no editor, no DOM, and no `@puckeditor/core` in the
bundle. An application that renders a page in a server component and prefers the
editor's renderer directly can still import `Render` from `@puckeditor/core` and
pass `asheePuckConfig` to it.

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

A block is a spec plus one drawing per platform.

The spec states its props, its fields and the value it starts as, and it lives with
the other specs so both platforms read it:

```ts
// src/shared/blocks/content.ts
import { textField, selectField } from "../fields";
import type { AsheeBlockSpec } from "../types";

export type AlertBlockProps = {
  title?: string;
  tone?: "info" | "success" | "warning" | "error";
};

export const ALERT_SPEC: AsheeBlockSpec<AlertBlockProps> = {
  label: "Notice",
  fields: {
    title: textField("Wording", "A new version is available"),
    tone: selectField("Tone", ["info", "success", "warning", "error"] as const),
  },
  defaultProps: { title: "A new version is available", tone: "info" },
};
```

Each platform adds the drawing, which is the only part that differs:

```tsx
// src/web/blocks/utility.tsx
import { Alert } from "@asheeui/web";

export const alertBlock: AsheeBlock<AlertBlockProps> = {
  ...ALERT_SPEC,
  render: ({ title, tone }) => <Alert type={tone ?? "info"}>{title}</Alert>,
};
```

```tsx
// src/native/blocks/utility.tsx
import { Alert } from "@asheeui/native";

export const alertBlock: AsheeBlock<AlertBlockProps> = {
  ...ALERT_SPEC,
  render: ({ title, tone }) => <Alert type={tone ?? "info"}>{title}</Alert>,
};
```

Register it under its name in both registries, file it under a category in
`PUCK_CATEGORIES`, and add the name to `PUCK_BLOCK_NAMES` — the package's own
tests fail until the three agree. They assert that every name has a spec and every
spec has a name, that every block is labelled and holds fields, that every field
is a type the builder knows, that every category names blocks that exist and files
each of them once, and that every default value survives a JSON round trip. Each
platform's suite then asserts that every block the registry carries draws.

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

---

Built with AI. See [Ashee Softworks](https://asheesoftworks.com).
