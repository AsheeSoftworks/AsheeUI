# Playgrounds

AsheeUI ships official playground applications: Next.js, Vite and TanStack Start.
They are not three demo applications. They are three framework entry points into
**one application**, and they exist so that every part of the framework is
exercised the way a consumer uses it: server-rendered, hydrated, in a real build,
in the framework's own router.

Expo is the planned fourth entry point. It is not in this release, because the
native package does not yet carry every component the shared application renders:
a copied Expo project would be a promise the framework cannot keep. `asheeui
playground expo` lists the target and refuses it with that reason, and the
remaining native components are the increment that unblocks it.

## One application, three doors

```text
                     shared playground application
                     (packages/e2e-gallery)
                                │
        ┌───────────────┬───────┴───────┬───────────────┐
        │               │               │               │
      Next.js          Vite         TanStack          Expo
      (router)       (router)        (router)        (planned)
        │               │               │               │
   app/layout      entry-client     routes/index      app/…
   app/page        entry-server     routes/__root     app/…
        │               │               │               │
        └───────────────┴───────┬───────┴───────────────┘
                                │
                    AsheeUI components and layouts
```

The shared application owns:

- the screens, the demonstration data and the section order;
- the interaction state (`useState` and the handlers beside it);
- the provider and the configuration;
- the contract each screen must satisfy, and the interactions a consumer performs.

A framework entry point owns only what its framework requires:

- the document shell (Next's `app/layout.tsx`, TanStack's `routes/__root.tsx`,
  Vite's `index.html`), because the framework owns the document;
- the routing (Next's App Router, TanStack Router, Vite's entry pair);
- the platform adapters: the router's link component and the framework's image
  component, which are passed into the shared application through AsheeUI's own
  [substitution API](./components.md).

That boundary is why the playgrounds cannot drift apart: there is one place where
a screen, a label or a handler can change, and the distribution asserts that every
shipped copy is byte for byte the file this repository verifies.

## Running a playground

```bash
pnpm --filter @asheeui/next-playground dev        # http://localhost:3000
pnpm --filter @asheeui/vite-playground dev        # http://localhost:5173
pnpm --filter @asheeui/tanstack-playground dev    # http://localhost:3000
```

Each one also has a test command, and every test asserts the same contract:

```bash
pnpm --filter @asheeui/next-playground test
pnpm --filter @asheeui/vite-playground test
pnpm --filter @asheeui/tanstack-playground test
```

A playground's test proves four things about its framework: the screen renders on
the server, the prerendered page satisfies the shared contract, the same tree
hydrates without a mismatch, and every interaction still behaves after hydration. A
section that only becomes correct in a browser therefore fails the test rather than
passing quietly.

## Getting a playground with the CLI

```bash
npx asheeui playground --list            # the playgrounds this version ships
npx asheeui playground next ./invoices   # create one in ./invoices
npx asheeui playground vite ./shop --force
```

The copied project is a working application rather than a fragment of this
repository:

| Property | How it holds |
| --- | --- |
| It depends on the published framework | Its `package.json` depends on `asheeui` at a released range |
| It carries no repository-only code | The shared application travels inside it as `playground/`; any `workspace:` range and any dependency on the repository's own packages are removed as the template is generated |
| It installs and runs on its own | `pnpm install` then `pnpm dev`, with this framework's usual scripts |
| It verifies itself | It ships the contract its sections satisfy, so `pnpm test` proves the installation works before any application code is written |
| It configures nothing | Its configuration is the same empty object, so the framework's defaults are what it shows |

The templates are generated from the playgrounds in this repository rather than
written twice, so the project a client receives is the project the repository
verifies — which is to say the files the repository tracks, because a build leaves
files of its own in an application directory and none of them belong to a client's
project:

```bash
pnpm --filter @asheeui/cli sync:playground-templates   # regenerate all three
```

Two tests hold that. One requires every template's application modules to be the
exact files this repository verifies. The other regenerates all three templates
into a directory of its own and requires every committed file — shell,
application, manifest and README — to be the file the generator produces today, so
a shell that changed without a regeneration is a failing test rather than a
silently stale project. A further test asserts what a template may and may not
contain: no dependency tree, no build output, no cache, no repository build stamp,
and no package that exists only inside the monorepo.

The templates are excluded from the repository's format check for the same reason
build output is: they are generated, and the parity test is what asserts their
content. What the generator copies is already formatted, because it is copied from
sources that are checked.

## Verifying a distribution

Content checks cannot tell you whether a copied project works; only installing one
can. Two defects reached `main` that every content check passed — a copied project
whose TypeScript configuration reached back into this repository, and a template
that carried a build artifact a build had left behind — and both were found by
copying a project and building it. The repository has a command for exactly that,
and CI runs it:

```bash
pnpm build
pnpm verify:distribution                    # every target
pnpm verify:distribution --targets vite     # one of them
pnpm verify:distribution --published        # the released range, after a release
```

It packs the library the way the registry serves it (`pnpm pack` applies
`publishConfig`), copies each playground with the CLI, points the copy at that
package, installs it, runs the project's own test suite, and builds both of its
entries. The copies are made outside the repository and removed again when
everything passes; `--keep` leaves them for inspection, and a failure always does.

`.github/workflows/distribution.yml` runs the same command on every push to `main`,
nightly, and on request, so a distribution that stops working is a failed run
rather than a report from a client.

A distribution is safe by default: if the destination already holds any of the
project's files, the command writes nothing and says which files it found. Pass
`--force` to replace the files the playground owns, which leaves every other file
in the directory untouched.


## Nothing is configured, on purpose

The playgrounds run with an **empty** configuration:

```ts
export const playgroundConfig: ExternalConfig = {};
```

AsheeUI owns its defaults: the theme, the variant, the colour, the radius, the
spacing scale, the typography roles and every component's registered defaults. A
consumer states only what it wants to change. The playgrounds override nothing, so
running one is the proof that the framework is complete without a consumer
restating its own baseline, and the shared application's test asserts that the
empty configuration resolves to the baseline the
[configuration documentation](./configuration.md) states.

If you are looking for an example to copy, copy how little is configured rather
than copying values out of the framework.

## What the application code may contain

The playground application and the shared application are written **entirely in
AsheeUI**:

- no authored HTML elements: a page is `Container`, a band is `Section`, a group is
  `Stack`, `HStack` or `VStack`, a deck is `Grid`, two panes are `Split`, a
  paragraph is `Typography`, and a card is `Card`;
- no Tailwind utility classes: spacing, width, rhythm, alignment, colour and
  typography come from a component's props, its variants or the configuration
  cascade.

Three things sit outside that rule, because they are the platform boundary rather
than the application:

| Boundary | Why it exists |
| --- | --- |
| The document shell (`<html>`, `<body>`, `index.html`) | The framework owns the document; an application cannot express it in components |
| The router and image adapters (a `next/link`, a router `Link`, a stand-in for one) | AsheeUI's substitution API is defined by a consumer component that renders one element; the adapter is that component, and it is what the framework's router reaches into |
| The stylesheet entry (`@import "tailwindcss"` then `@import "asheeui/styles"`) | AsheeUI's styling engine is Tailwind-based; the import is how the framework's stylesheet reaches the page, and it is not a utility class in application code |

One further rule follows from how AsheeUI is built, and it is a rule about
boundaries rather than about markup: **AsheeUI components are client components**,
so a React Server Component reaches them through a client island rather than by
importing the framework itself. The shared application states `"use client"` once,
at the application, and each shell renders an island. A server component that
imports `asheeui` directly fails the framework's build, which is the intended
behaviour: the provider and the components that read it belong on the client.

---

Built with AI, using the process described in [How AsheeUI is built](published-process.md).
