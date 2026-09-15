# Installation

AsheeUI is a React component framework for Tailwind CSS v4. It needs no bundler
plugin, no build-time configuration file and no CLI: two imports and a provider
are the whole setup.

## Requirements

| Requirement | Version |
| --- | --- |
| React | 18.2 or newer, or 19 |
| React DOM | the same major as React |
| Tailwind CSS | 4.0 or newer |

## Install the package

```bash
npm install asheeui
```

```bash
pnpm add asheeui
```

```bash
yarn add asheeui
```

```bash
bun add asheeui
```

## Import the styles

Add the framework stylesheet to the CSS entry file that Tailwind already uses,
after the Tailwind import:

```css
@import "tailwindcss";
@import "asheeui/styles";
```

The order matters: `asheeui/styles` extends the Tailwind theme with the
framework's colour tokens, so it has to come after Tailwind's own import.

## Wrap the application root

Every component reads its configuration from the provider, so the root of the
application has to be wrapped once:

```tsx
import { AsheeUIProvider } from "asheeui";
import type { ReactNode } from "react";

export function Root({ children }: { children: ReactNode }) {
  return <AsheeUIProvider>{children}</AsheeUIProvider>;
}
```

The `config` prop is optional. Without it the framework uses its built-in
defaults; pass an object to change them (see [Configuration](./configuration.md)).

### Where the root is

| Framework | File | What to wrap |
| --- | --- | --- |
| Vite | `src/main.tsx` | the element passed to `createRoot` |
| Next.js App Router | `app/layout.tsx` | the `{children}` inside `<body>` |
| TanStack Start | `src/routes/__root.tsx` | the route content |

In an App Router application the provider is a client component, so the file
that renders it needs `"use client"` at the top, or the provider has to sit in a
small client component that the layout renders.

## Use the components

```tsx
import { Button } from "asheeui";

export function SaveButton() {
  return <Button>Save</Button>;
}
```

## Verify the setup

Render a component and check two things: it appears with the framework's colours
and spacing, and no framework warning reaches the console. If either fails, see
the common cases below.

| Symptom | Cause | Fix |
| --- | --- | --- |
| Components render unstyled | The stylesheet import is missing, or it comes before the Tailwind import | Import `tailwindcss` first, then `asheeui/styles` |
| `useAsheeConfig must be used within an AsheeUIProvider` | The provider is not above the component | Wrap the application root once |
| Colours do not change with the theme | The theme class is not on the document root | Check that the provider renders; it applies the class itself |
| A client component throws in Next.js | The provider is rendered from a server component | Move it into a client component |

## Optional: the CLI

`@asheeui/cli` can write the stylesheet import, create a configuration file and
wrap the application root for you, and it can check an existing setup. Nothing
above requires it, and the framework works without it. See [CLI](./cli.md).
