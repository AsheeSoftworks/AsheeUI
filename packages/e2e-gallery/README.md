# AsheeUI end-to-end gallery

The content that the three playground applications render, and the contract that
each playground's end-to-end test asserts. This package is internal verification
infrastructure: it is private and is never published.

## Why it exists

AsheeUI is consumed by client-rendered, server-rendered and full-stack React
applications, so "the library works" is a claim about all of them. Rather than
write the same checks three times, the gallery holds one set of sections and one
contract, and each playground contributes only what makes it that framework: its
router, its link and image components, its server renderer and its entry point.

A green playground therefore means the same thing in every framework: the served
markup satisfies the contract, that markup hydrates without React reporting
anything, and the interactions a consumer performs still behave.

## The contract model

A section pairs three things in one place, so a component's consumer-facing
behaviour is described once:

- `Component`, the markup the playground renders;
- `inspect(root)`, which checks that markup and returns one description per
  problem, or an empty array when the section is correct;
- `interaction.run(container)`, the consumer interaction the section supports,
  performed against a hydrated tree and reported in the same way.

The contract is plain functions rather than test-framework assertions, so the
same checks run against a framework's server markup, against the hydrated DOM,
and inside this package's own test without depending on an assertion library.

`inspect` and `interaction` report problems instead of throwing, so one run
describes every broken part of a section rather than only the first.

## What it exports

| Export | Purpose |
| --- | --- |
| `Gallery` | Renders every section in a labelled landmark and forwards the substitution props. |
| `GALLERY_SECTIONS` | The sections, in render order. |
| `inspectGallery(root)` | Runs every section's `inspect` against a document, a container or parsed server markup. |
| `gallerySectionIds()` | The section identifiers, which are also the `data-gallery-section` values. |
| `GALLERY_INTERACTIONS` | The interactions the sections support, with their identifiers and descriptions. |
| `runGalleryInteractions(container)` | Performs every interaction against a hydrated tree. |
| `renderServerMarkup(tree)` | Renders a playground's tree to markup, the way its framework does on the server. |
| `parseMarkup(html)` | Parses server markup into a container so the contract can be checked against the markup itself. |
| `hydrateMarkup(html, tree)` | Hydrates server markup and returns the container, everything React reported, and an unmount hook. |
| DOM helpers | `accessibleNameOf`, `createReport`, `createSectionReport`, `requireAbsent`, `requireAnyText`, `requireAttribute`, `requireAttributes`, `requireElement`, `requireName`, `requireOwnText`, `requireText`, `textOf`. |
| Event helpers | `click`, `focus`, `press`, `settle`, `waitFor`. |

`Gallery` accepts `title`, plus `linkComponent`, `imageComponent`, `linkProps`
and `imageProps`, which are how a framework's router link or image component
reaches the sections that render one.

`@asheeui/e2e-gallery/setup` installs the browser-environment stand-ins the
playground tests need (`ResizeObserver`, `IntersectionObserver`, `matchMedia`,
`scrollIntoView` and `scrollTo`), matching the framework's own component tests:
they cover only what jsdom cannot provide, and nothing about a component is
mocked.

## The sections

| Section | Covers |
| --- | --- |
| `typography` | `Typography` roles and semantic elements. |
| `buttons` | `Button` variants, its busy and disabled states. |
| `badges` | `Badge` colours, and the icon-only labelling contract. |
| `chips` | `Chip`, including the remove control. |
| `fields` | `Input` and `Switch` labels, descriptions and validation messages. |
| `skeletons` | `Skeleton`, decorative and labelled-busy. |
| `alerts` | `Alert` intents, announcement roles and the dismiss control. |
| `avatars` | `Avatar` pictures, initials fallback and the image substitution point. |
| `links` | `Link`, including the consumer link substitution. |
| `breadcrumb` | `Breadcrumb` landmark, ordered trail and current location. |
| `pagination` | `Pagination` range, current page and link mode. |
| `form` | `Form` native submission, its fieldset grouping and its submit control. |
| `spinner` | `Spinner` as a decorative indicator. |
| `tabs` | `Tabs` keyboard interaction and panel relationships. |
| `accordion` | `Accordion` expand, collapse and the collapsed panel's exposure. |
| `modal` | `Modal` portal, accessible name, `aria-modal` and Escape dismissal. |
| `tooltip` | `Tooltip` description relationship and content. |

The sections cover the newest additions first, because their consumer integration
is the least proven, then the established components that exercise the
configuration, theme and layout layers. The internal helpers (`field`, `menu`)
are absent, because they are not part of the public surface.

## Wiring a playground

1. Render `Gallery` inside the framework's tree, inside `AsheeUIProvider`, and
   pass the framework's own link and image components so substitution is
   exercised.
2. Server-render that tree the way the framework does, parse the markup with
   `parseMarkup`, and assert `inspectGallery(...)` is empty.
3. Hydrate the same markup with `hydrateMarkup`, assert it reported no errors,
   assert the contract again, and then assert `runGalleryInteractions(...)` is
   empty.
4. Assert the framework's substitution marker on the anchors and pictures the
   library rendered, so a plain element from the library fails the test.

Each playground's README records what those steps prove for its framework.

## Running it

```bash
pnpm --filter @asheeui/e2e-gallery test      # the gallery's own test
```

The gallery's own test proves both directions: that the gallery satisfies its
contract on the server and after hydration, and that the contract reports a
problem when a section, a component or an interaction is broken. Without the
second half, a green playground would prove nothing.

