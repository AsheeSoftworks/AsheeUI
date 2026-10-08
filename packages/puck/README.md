# @asheeui/puck

The AsheeUI [Puck](https://puckeditor.com) integration: one block registry behind one
import, usable by a web application and by a React Native one.

A page composed in a visual builder has to mean the same thing on a browser and on a
device. This package is arranged so that it does: the block **specs** — the label a
builder shows, the fields it fills in, the value each block starts as — live once, and
each platform supplies only the drawing.

```bash
npm install @asheeui/puck @puckeditor/core
```

`@puckeditor/core` is an optional peer. It is needed by the web half alone; the native
half loads without it.

## What each platform gets

| Platform | The package is | You write |
| --- | --- | --- |
| Web | the editor's block registry (`asheePuckConfig`) and the editor's page renderer | `<Puck config={asheePuckConfig} … />` to compose, `<PuckPage data={page} />` to show |
| React Native | the same specs, plus a renderer that draws a stored page with the native components | `<PuckPage data={page} />` |

There is no editor on native, and none is planned: a device **shows** a page. What
composes one is the web editor, which is where authoring happens.

## Usage

The editor, on the web:

```tsx
import { Puck } from "@puckeditor/core";
import { asheePuckConfig } from "@asheeui/puck";
import "@puckeditor/core/puck.css";
import "@asheeui/web/styles";

export function Editor() {
  return <Puck config={asheePuckConfig} data={savedPage} onPublish={save} />;
}
```

A published page, on either platform — the same import, the same call:

```tsx
import { PuckPage } from "@asheeui/puck";

export function PublishedPage({ page }) {
  return <PuckPage data={page} />;
}
```

Blocks resolve their theme through the framework provider. The page shell supplies one
when the application has not, and respects the one it already has, so a `defaultTheme`
or a component override in your own provider keeps applying to a built page.

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

There are no `PuckHero`, `PuckNavbar` or `PuckFooter` components. Each block is the
framework component plus the configuration a builder can own, so a block cannot drift
away from the component an application renders — and a block added once is offered by
both platforms.

## The configuration boundary

A block exposes its **visual configuration**, not its React API. The boundary is the
same for every block:

| In the configuration | Out of the configuration |
| --- | --- |
| Wording, alignment, spacing, background, columns | Icons and arbitrary React nodes |
| Destinations and action wording | Click handlers and functions |
| Repeatable content (features, quotes, links) | Data from an application, a database or a request |

Everything inside the configuration survives a JSON round trip, which is what a saved
page is. A block that needed a runtime value would be a component problem rather than a
builder problem.

## Layout

```text
src/
  shared/   the specs, the field builders and the adapters — no renderer, no editor
  web/      the editor's registry, its page renderer and the DOM drawings
  native/   the native registry, the stored-page renderer and the platform drawings
  index.ts          the web entry   (`@asheeui/puck`)
  index.native.ts   the native entry (Metro's `react-native` field)
```

The split is the reason the package can be used on both platforms: a browser bundle
reaches `web/` alone, and a device bundle reaches `native/` without loading React DOM,
Tailwind or the editor.

## Adding a block

A block is one entry in `src/shared/blocks` plus one drawing per platform. State the
specs — the label, the fields and the default value — and then render the component on
each platform, reading the props the spec describes. A test in the same change asserts
what `src/shared/spec.test.ts` asserts for every block: that the block is labelled, that
its fields are types a builder understands, that it is filed under a category, and that
its defaults survive a JSON round trip.

## Requirements

- React 18 or 19.
- `@puckeditor/core` `^0.23.0` for the web half.
- `react-native` and `nativewind` for the native half, configured the way
  [the native package](https://github.com/AsheeSoftworks/AsheeUI/blob/main/docs/native.md)
  documents. Add `@asheeui/puck` to the Tailwind content globs as well, so the classes
  the native drawings name are compiled.

---

Built with AI. See [Ashee Softworks](https://asheesoftworks.com).
