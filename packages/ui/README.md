# asheeui

A React UI framework built on Tailwind CSS v4. Accessible, config-driven
components, a layout system, the sections a page is made of, and a Puck
integration behind their own entry point.

## Features

- **Config-driven** — theme, variant, color, radius and spacing defaults resolve
  through one cascade, so a value can be set globally, per component or per
  instance.
- **A layout system** — `Container`, `Section`, `Stack`/`HStack`/`VStack`,
  `Grid`, `Page`/`PageHeader`/`PageContent`/`PageFooter`, plus `SidebarLayout`
  and `AuthLayout` for application pages.
- **Page sections** — `Navbar`, `Hero`, `FeatureGrid`, `CTA`, `Testimonials`,
  `PricingCard` and `Footer`, each taking its actions as configuration.
- **Puck integration** — `asheeui/puck` exposes the same components as builder
  blocks, so an application, an editor and a published page share one
  implementation. `@puckeditor/core` is an optional peer dependency.
- **Tailwind CSS v4** — class names are static and complete, and colours resolve
  through CSS custom properties.
- **Light and dark themes** — built-in `light`, `dark` and `system` themes, plus
  custom themes.
- **Accessible** — landmarks, names, keyboard behaviour and announced state are
  part of each component's contract, with tests that state them.
- **TypeScript-first** — fully typed configuration, theme registry and component
  props, with JSDoc on every exported symbol.

## Requirements

- React 18 or newer
- Tailwind CSS v4
- Node.js 22.12 or newer for development

## Installation

```bash
npm install asheeui
```

Import the stylesheet once and wrap your root in the provider:

```css
@import "tailwindcss";
@import "asheeui/styles";
```

```tsx
import { AsheeUIProvider } from "asheeui";
```

The optional `@asheeui/cli` package can scaffold that setup and check it, but it
is not required: the two steps above are the whole setup.

## Documentation

The framework documentation lives in the repository:

- [Installation](https://github.com/AsheeSoftworks/AsheeUI/blob/main/docs/installation.md)
- [Configuration](https://github.com/AsheeSoftworks/AsheeUI/blob/main/docs/configuration.md)
- [Components](https://github.com/AsheeSoftworks/AsheeUI/blob/main/docs/components.md)
- [Puck](https://github.com/AsheeSoftworks/AsheeUI/blob/main/docs/puck.md)
- [Accessibility](https://github.com/AsheeSoftworks/AsheeUI/blob/main/docs/accessibility.md)
- [Migration](https://github.com/AsheeSoftworks/AsheeUI/blob/main/docs/migration.md)

## Quick start

```tsx
import { Button, Page, PageContent, Hero } from "asheeui";

export function App() {
  return (
    <Page>
      <PageContent>
        <Hero
          title="Run your campaigns from one place"
          primaryAction={{ label: "Start free", href: "/signup" }}
        />
        <Button>Hello AsheeUI</Button>
      </PageContent>
    </Page>
  );
}
```

A complete page is `Navbar`, a band or two, and `Footer`, all of them composing
through `Page`, `Section`, `Container` and `Grid`.

## Theming

Themes are CSS custom properties (`--ashee-background`, `--ashee-primary`, and
so on), applied by the provider before the first paint. `useTheme` switches the
theme at runtime and records the preference, `themeController` does the same
outside React, and a theme is defined as a block in the configuration.

## Links

- Documentation: https://asheeui.com
- Repository: https://github.com/AsheeSoftworks/AsheeUI
- Issues: https://github.com/AsheeSoftworks/AsheeUI/issues

## License

MIT

