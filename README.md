[![npm version](https://img.shields.io/npm/v/asheeui?style=flat-square&logo=npm)](https://www.npmjs.com/package/asheeui)
[![license](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![build](https://img.shields.io/github/actions/workflow/status/AsheeSoftworks/AsheeUI/ci.yml?branch=main&style=flat-square&logo=github)](https://github.com/AsheeSoftworks/AsheeUI/actions/workflows/ci.yml)
[![GitHub release](https://img.shields.io/github/v/release/AsheeSoftworks/AsheeUI?style=flat-square&logo=github)](https://github.com/AsheeSoftworks/AsheeUI/releases)

# AsheeUI

`AsheeUI` is a modern React component library that combines accessibility,
performance, and deep Tailwind CSS integration. Components ship with
first-class TypeScript types, theme token inheritance, and zero-config setup
for the most popular React frameworks.

## Features

- Accessible React components built on Floating UI for positioning, focus
  management, and keyboard interaction.
- A cascade config system: instance props, then `components.<name>` config,
  then global defaults, then a hardcoded fallback, so you can theme at any
  level.
- Native Tailwind CSS v4 token integration with variant, color, radius, and
  size scales shared across every component.
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

**2. Initialize the integration** from your project root. The CLI detects
your framework, creates an `asheeui.config.*` file, and wraps your app in the
runtime `AsheeUIProvider`:

```bash
npx asheeui init
```

**3. Use the components** anywhere in your app:

```tsx
import { Select } from "asheeui";
import { useState } from "react";

export function Example() {
  const [value, setValue] = useState<string | number>("react");

  const options = [
    { label: "React", value: "react" },
    { label: "Vue", value: "vue" },
    { label: "Svelte", value: "svelte" },
  ];

  return (
    <Select
      options={options}
      value={value}
      onValueChange={setValue}
      label="Select Framework"
      placeholder="Choose a framework..."
    />
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
- Browse the components: https://github.com/AsheeSoftworks/AsheeUI/tree/main/packages/ui/src/components
- Releases: https://github.com/AsheeSoftworks/AsheeUI/releases
- Commenting and JSDoc standards: https://github.com/AsheeSoftworks/AsheeUI/blob/main/docs/commenting.md

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) for local setup, the changeset
workflow, and the coding conventions. All participation follows our
[Code of Conduct](CODE_OF_CONDUCT.md).

## License

AsheeUI is MIT licensed. See [LICENSE](LICENSE) for the full text.
