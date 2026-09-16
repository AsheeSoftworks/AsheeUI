[![npm version](https://img.shields.io/npm/v/asheeui?style=flat-square&logo=npm)](https://www.npmjs.com/package/asheeui)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue?style=flat-square)](LICENSE)
[![build](https://img.shields.io/github/actions/workflow/status/AsheeSoftworks/AsheeUI/ci.yml?branch=main&style=flat-square&logo=github)](https://github.com/AsheeSoftworks/AsheeUI/actions/workflows/ci.yml)
[![GitHub release](https://img.shields.io/github/v/release/AsheeSoftworks/AsheeUI?style=flat-square&logo=github)](https://github.com/AsheeSoftworks/AsheeUI/releases)

# AsheeUI

`AsheeUI` is a React UI framework built on Tailwind CSS v4. It gives an
application one configuration cascade, one theme system, one layout system and
one accessibility baseline, so structure, components, theming and behaviour stay
consistent instead of being reassembled per project. Components ship with
first-class TypeScript types, and the framework needs no bundler plugin, no
build-time configuration file and no CLI.

## See it running

| What | Where |
| --- | --- |
| Documentation and the component reference | [asheeui.com](https://www.asheeui.com) |
| What the framework cost to build, with the receipt | [asheeui.com/docs/build-cost](https://www.asheeui.com/docs/build-cost) |
| The company that maintains it | [asheesoftworks.com](https://asheesoftworks.com) |
| The web package | [npmjs.com/package/asheeui](https://www.npmjs.com/package/asheeui) |

The playground applications in this repository render the same gallery, and each one's
end-to-end test asserts it. They are the stress test rather than the brochure: a
component that only looks right in one state is meant to fail there.

## One install, then copy and paste

```bash
npx @asheeui/cli@latest init
```

The CLI writes a working application. After that, a component is either imported from
the package or copied out of the documentation, and both work for the same reason: what
a component needs comes from the theme rather than from the file it lives in.

There is no build plugin and no configuration file to register. A component pasted into
a project compiles, takes the theme that project declares, and inherits its defaults.

## Platforms

One theme, one set of components, declared in the same shape wherever the application
runs:

| Platform | How | State |
| --- | --- | --- |
| Web | `asheeui` on React, styled by Tailwind CSS v4 | Published, and what the documentation covers |
| Mobile | `@asheeui/native` on React Native, through Expo | In this repository; the playground builds for it and exports to the web |
| Desktop | The web application, framed by whatever packages it | Follows the web build |

A colour is decided once and is the same colour on every platform, because a platform
declares a theme rather than a set of styles.

## How AsheeUI is built

AsheeUI is built with AI, using a written process rather than a prompt. The process
runs as a loop, and each stage ends in a state a person can inspect:

```text
objective  intent, constraints and acceptance criteria, written first
state      requirements, decisions, tests and the current implementation, read together
plan       steps small enough to test, each with the evidence that would satisfy it
act        the implementation, written with the project's own tools and conventions
verify     tests, types, builds and audits; not an opinion about the code
diagnose   the class of a failure, decided before any repair
repair     the correction, then verification again; two failures of a kind stop the loop
review     the state, the evidence and the open questions, presented to a person
```

The automated part may inspect, plan, implement, test, classify a failure, repair
it, refactor, document and prepare a release for review. It stops, and asks, before
anything irreversible, before a change to the architecture or to the meaning of a
requirement, before a conflict only the owner can settle, and before work outside
the authority the project granted it. The boundary is part of the design rather than
a property of the current model.

The full statement, including what evidence a reader can check and what the process
does not claim, is in [How AsheeUI is built](docs/published-process.md).

The process is maintained by Ashee Softworks, with the measurements of the experiments
run against it. The company's site is at
[asheesoftworks.com](https://asheesoftworks.com): it is in its **opening state and
announces nothing yet**, and it is where the algorithm, the standards position and
the two events will be documented as the launch proceeds.

## Features

- Accessible React components built on Floating UI for positioning, focus
  management, and keyboard interaction.
- A cascade config system: instance props, then `components.<name>` config,
  then global defaults, then a hardcoded fallback, so you can theme at any
  level.
- A layout system (`Container`, `Section`, `Stack`, `Grid`, `Centered`,
  `Split`, `Page`) and the page compositions (`MarketingLayout`, `DocsLayout`,
  `SidebarLayout`, `AuthLayout`) needed to build a whole page without a second
  layout library.
- The components an application page is built from (`SearchInput`, `Stepper`,
  `DataTable`, `FileUpload`, `LoadingState`, `ErrorState`), each composed from
  the primitives below it rather than reimplementing them.
- A React Native package that shares the component vocabulary, the prop contracts
  and the design language with the web package: the layout kit, `Text`, `Card`,
  `Badge`, `Input`, `Button`, and a responsive vocabulary that reads the platform's
  window.
- The sections a marketing page is made of (`Navbar`, `Hero`, `FeatureGrid`,
  `CTA`, `Testimonials`, `PricingCard`, `Footer`), each taking its actions as
  configuration.
- A [Puck](docs/puck.md) integration behind its own entry point, so the same
  components power a React application, a visual editor and a published page.
- Native Tailwind CSS v4 token integration with variant, color, radius, size
  and spacing scales shared across every component.
- Portal-aware overlays. Menus, modals, drawers, toasts, and tooltips render
  through a portal by default, so they escape overflow and stacking contexts.
- First-class TypeScript support with field-level JSDoc annotations and
  in-editor examples.
- Zero-config setup across Next.js, Vite, and TanStack Start.
- Runtime customization through a single `AsheeUIProvider` context. No bundler
  plugins or build-time config shims.

## Installation

Add `asheeui` with your favorite package manager. Tailwind CSS v4 is required
as a peer dependency.

**npm**

```bash
npm install asheeui
```

**pnpm**

```bash
pnpm add asheeui
```

**yarn**

```bash
yarn add asheeui
```

**bun**

```bash
bun add asheeui
```

**Deno**

```bash
deno add npm:asheeui
```

## Quick Start

**1. Import the styles** into your global CSS entry file:

```css
@import "tailwindcss";
@import "asheeui/styles";
```

**2. Wrap your app root** in `AsheeUIProvider`:

```tsx
import { AsheeUIProvider } from "asheeui";
import type { ReactNode } from "react";

export function Root({ children }: { children: ReactNode }) {
  return <AsheeUIProvider>{children}</AsheeUIProvider>;
}
```

The `config` prop is optional, and so is an `asheeui.config.*` file. Pass a
config to change the defaults:

```tsx
<AsheeUIProvider config={{ defaultTheme: "dark" }}>{children}</AsheeUIProvider>
```

**3. Use the components** anywhere in your app:

```tsx
import { Dropmenu } from "asheeui";
import { useState } from "react";

export function Example() {
  const [value, setValue] = useState<string | number>("react");

  const options = [
    { label: "React", value: "react" },
    { label: "Vue", value: "vue" },
    { label: "Svelte", value: "svelte" },
  ];

  return (
    <Dropmenu
      options={options}
      value={value}
      onValueChange={setValue}
      label="Select Framework"
      placeholder="Choose a framework..."
    />
  );
}
```

## Building a page

The layout components and the page sections compose into a complete page, and
the same components are available to a visual builder:

```tsx
import {
  Container, CTA, FeatureGrid, Footer, Grid, Hero, Navbar,
  Page, PageContent, Section, Typography,
} from "asheeui";

export function Home() {
  return (
    <Page>
      <Navbar
        brand="Ashee"
        align="center"
        links={[{ label: "Pricing", href: "/pricing" }]}
        actions={<Button size="sm">Sign in</Button>}
      />
      <PageContent contained={false} spacing="none">
        <Hero
          title="Run your campaigns from one place"
          primaryAction={{ label: "Start free", href: "/signup" }}
        />
        <Section spacing="xl" background="muted">
          <Container>
            <Typography role="heading-xl">Everything the campaign needs</Typography>
            <Grid columns={1} columnsMd={2} columnsLg={3} gap="lg" className="mt-8">
              <Card title="Templates" description="Reusable messages." />
            </Grid>
          </Container>
        </Section>
        <FeatureGrid title="Why teams switch" items={features} />
        <CTA title="Send your first campaign today" />
      </PageContent>
      <Footer brand="Ashee" groups={groups} copyright="Ashee Softworks" />
    </Page>
  );
}
```

A [Puck](docs/puck.md) editor builds the same page from the same components:

```tsx
import { asheePuckConfig } from "asheeui/puck";

<Puck config={asheePuckConfig} data={page} onPublish={save} />;
```

## Optional CLI

`@asheeui/cli` is a convenience for setup and for checking an existing project.
It is not required: everything above is the whole setup, and the framework works
without it.

```bash
npx asheeui init     # write an asheeui.config.* file and wrap your app root
npx asheeui doctor   # check styles, provider, dependencies and configuration
npx asheeui fix      # apply the repairs doctor can make automatically
npx asheeui list     # list the components this version exports
```

## Documentation

| Document | Covers |
| --- | --- |
| [Installation](docs/installation.md) | Requirements, the stylesheet import, wrapping the root, where the root is per framework, troubleshooting |
| [Release 2.0.0](docs/release-2.0.0.md) | What this release adds: the completed layout layer, the page compositions, the new components and the native component set |
| [Layouts](docs/layouts.md) | The layout layer, the four compositions, the responsiveness rules and the native equivalents |
| [Release 1.1.0](docs/release-1.1.0.md) | What the 1.1 release added: the layout system, the page components and the Puck integration |
| [Release 1.0.0](docs/release-1.0.0.md) | The upgrade guide from 0.7.0: what breaks a build, what changed in behaviour, what is new |
| [Configuration](docs/configuration.md) | The cascade, the global and per-component keys, the theme system, scrollbars, validation |
| [Components](docs/components.md) | The component set, the shared prop axes, the substitution API, the field contract |
| [Puck](docs/puck.md) | The block registry, the configuration boundary, the published-page path, what is deferred |
| [React Native](docs/native.md) | The shared layer, what is shared and what is not, the layout kit, the responsive vocabulary, native setup, testing and accessibility |
| [Licensing](docs/licensing.md) | The Apache-2.0 terms, what redistribution requires, the trademark position, the MIT transition |
| [Accessibility](docs/accessibility.md) | The conformance target, keyboard behaviour, structure, known limits |
| [CLI](docs/cli.md) | The optional scaffolding, checking and repair commands |
| [Migration](docs/migration.md) | The deprecation policy in force from 1.0 and every breaking change with its migration |
| [Commenting standard](docs/commenting.md) | How the source documents itself |

## LLM & AI Assistant Support

Using AI coding tools? Feed our full documentation context to your assistant
via `https://asheeui.com/llms.txt`.

## Key Links

- Documentation: https://asheeui.com
- npm package: https://www.npmjs.com/package/asheeui
- GitHub repository: https://github.com/AsheeSoftworks/AsheeUI
- Browse the components: https://github.com/AsheeSoftworks/AsheeUI/tree/main/packages/ui/src/components
- Releases: https://github.com/AsheeSoftworks/AsheeUI/releases
- Commenting and JSDoc standards: https://github.com/AsheeSoftworks/AsheeUI/blob/main/docs/commenting.md

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) for local setup, the changeset
workflow, and the coding conventions. All participation follows our
[Code of Conduct](CODE_OF_CONDUCT.md).

## License

AsheeUI is licensed under the [Apache License 2.0](LICENSE). You may use, modify
and distribute it, including commercially, provided the copyright, patent and
attribution notices are kept; see [Licensing](docs/licensing.md) for what that
means in practice, including the trademark position.

The project is developed with the **AI Test Driven Development** methodology,
created by Ashee Softworks.
