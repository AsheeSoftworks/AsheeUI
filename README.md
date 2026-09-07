[![npm version](https://img.shields.io/npm/v/asheeui?style=flat-square&logo=npm)](https://www.npmjs.com/package/asheeui)
[![license](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](#license)
[![GitHub release](https://img.shields.io/github/v/release/AsheeSoftworks/AsheeUI?style=flat-square&logo=github)](https://github.com/AsheeSoftworks/AsheeUI/releases)
[![build](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square&logo=turborepo)](https://github.com/AsheeSoftworks/AsheeUI/actions)

# AsheeUI

`AsheeUI` is a modern React component library that combines accessibility,
performance, and deep Tailwind CSS integration. Components ship with
first-class TypeScript types, theme token inheritance, and zero-config setup
for the most popular React frameworks.

## Features

- High-performance React components built for speed and accessibility.
- Native Tailwind CSS token system integration with prop, component, theme,
  and fallback resolution tiers.
- First-class TypeScript hover support with field-level JSDoc annotations and
  in-editor examples.
- Zero-config setup across Next.js, Vite, and TanStack Start.
- Themeable primitives with variant, color, radius, and density scales.
- Keyboard navigation, ARIA semantics, and reduced-motion support built in.
- Runtime customization through a single `AsheeProvider` context - no bundler
  plugins or build-time config shims required.

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

**2. Initialize the integration** from your project root. The CLI detects
your framework, creates an `asheeui.config.*` file, and wraps your app in the
runtime `AsheeProvider`:

```bash
npx asheeui init
```

**3. Use the components** anywhere in your app:

```tsx
import { Button, Card } from "asheeui";

export function WelcomeCard() {
  return (
    <Card
      variant="elevated"
      radius="lg"
      title="Welcome to AsheeUI"
      description="A short description of what this card is showing."
    >
      <Button variant="solid" color="primary" onClick={() => console.log("Clicked")}>
        Get started
      </Button>
    </Card>
  );
}
```

## LLM & AI Assistant Support

Using AI coding tools? Feed our full documentation context to your assistant
via `https://asheeui.com/llms.txt`.

## Key Links

- Documentation: https://asheeui.com
- npm package: https://www.npmjs.com/package/asheeui
- GitHub repository: https://github.com/AsheeSoftworks/AsheeUI
- Releases: https://github.com/AsheeSoftworks/AsheeUI/releases
- Commenting and JSDoc standards: https://github.com/AsheeSoftworks/AsheeUI/tree/main/docs/commenting.md

## License

AsheeUI is MIT licensed.
