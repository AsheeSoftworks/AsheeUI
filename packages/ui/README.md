# asheeui

A config-driven React component library built on Tailwind CSS v4. Accessible, styled components with a unified configuration system — set defaults once, override them anywhere.

## Features

- **Config-driven** — Define theme, variant, color, and radius defaults in one place (`asheeui.config.ts`) and override at the component or instance level.
- **Tailwind CSS v4** — Built on the latest Tailwind with CSS-variable-driven theming.
- **Light & dark themes** — Ships with built-in `light`, `dark`, and `system` themes, plus full support for custom themes.
- **Accessible components** — Every component is designed with accessibility in mind.
- **Runtime theming** — Switch themes on the fly with the `useTheme` hook; preferences persist via `localStorage`.
- **TypeScript-first** — Fully typed config, theme registry, and component props.

## Requirements

- React 18 or newer
- Tailwind CSS v4
- Node.js 18 or newer

## Installation

The fastest way to get started is with the CLI. Run this in your project root:

```bash
npx asheeui@latest init
```

The CLI detects your framework, installs dependencies, adds the provider to your root layout, and configures Tailwind.

### Manual setup

Install the package:

```bash
npm install asheeui@latest
```

Add the styles import to your global CSS file (must come **after** the Tailwind import):

```css
@import "tailwindcss";
@import "asheeui/styles";
```

Wrap your app with `AsheeUIProvider`:

```jsx
import { AsheeUIProvider } from "asheeui";

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <AsheeUIProvider>{children}</AsheeUIProvider>
      </body>
    </html>
  );
}
```

> **Note:** `suppressHydrationWarning` is required on the `<html>` element to prevent hydration mismatches from theme switching.

### Framework guides

- [Next.js](/docs/installation/nextjs) — App Router and Pages Router
- [TanStack Start](/docs/installation/tanstack-start) — Full-stack React with TanStack Router
- [Vite + React](/docs/installation/vite) — Lightweight React SPA

## Quick start

Render a component:

```jsx
import { Button } from "asheeui";

function App() {
  return <Button>Hello AsheeUI</Button>;
}
```

You should see a styled button using the default theme.

## Configuration

AsheeUI is configured through an optional `asheeui.config.ts` file at your project root. Sensible defaults apply with no config at all.

```ts
// asheeui.config.ts
import type { ExternalConfig } from "asheeui";

export const config: ExternalConfig = {
  defaultTheme: "system",   // "light" | "dark" | "system"
  defaultVariant: "solid",  // "solid" | "ghost" | "bordered" | "faded" | "underlined"
  defaultColor: "primary",  // "none" | "default" | "primary" | "secondary" | "danger" | "warning" | "success"
  defaultRadius: "md",      // "none" | "xs" | "sm" | "md" | "lg" | "xl" | "full"
};
```

Values are resolved in this order (highest priority first):

1. **Instance prop** — `<Button variant="solid" />`
2. **Component config** — `components.button.variant`
3. **Theme default** — top-level `defaultVariant`, `defaultColor`, etc.
4. **Built-in fallback** — the library's internal default

### Per-component defaults

Set defaults for specific components while keeping global defaults for everything else:

```ts
export const config: ExternalConfig = {
  defaultVariant: "bordered",       // applies to all components
  components: {
    button: { variant: "solid" },   // overrides for Button only
    input:  { variant: "bordered", radius: "sm" },
    toast:  { variant: "bordered", placement: "bottom-right" },
  },
};
```

See the [Configuration docs](/docs/configuration) for the full reference.

## Theming

AsheeUI's theming system is CSS-variable-driven. It ships with `light`, `dark`, and `system` themes, and you can override tokens or define entirely custom themes.

### Switch themes at runtime

```jsx
import { useTheme } from "asheeui";

function ThemeSwitcher() {
  const { theme, setTheme, toggleTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme("dark")}>Dark</button>
      <button onClick={() => setTheme("light")}>Light</button>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}
```

`useTheme` returns:

| Property | Type | Description |
|---|---|---|
| `theme` | `ThemeSelection` | Current selected theme (`"light"` \| `"dark"` \| `"system"`) |
| `resolvedTheme` | `ThemeName` | Actual resolved theme (after system fallback) |
| `setTheme` | `(theme: ThemeSelection) => void` | Set the active theme |
| `toggleTheme` | `() => void` | Cycle to the next theme in sequence |
| `availableThemes` | `readonly string[]` | All registered theme names |

Theme preference persists across page reloads via `localStorage`.

### Override a built-in theme

```ts
export const config: ExternalConfig = {
  color: {
    light: { primary: "#7c3aed", background: "#faf5ff" },
    dark:  { primary: "#8b5cf6", border: "#3b3b3b" },
  },
};
```

Only the tokens you specify are overridden — everything else stays at the built-in default.

### Add a custom theme

Extend `light` or `dark` and override only what you need:

```ts
export const config: ExternalConfig = {
  defaultTheme: "company-red",
  color: {
    "company-red": {
      extends: "dark",
      background: "#1a0505",
      foreground: "#fef2f2",
      primary: "#dc2626",
      // ...other tokens inherit from dark
    },
  },
};
```

> **TypeScript:** Register custom theme names so `useTheme` and `setTheme` recognize them:
>
> ```ts
> declare module "asheeui" {
>   interface AsheeColorRegistry {
>     "company-red": true;
>   }
> }
> ```

See the [Theming docs](/docs/theming) for the full token list.

## Links

- [Documentation](/docs)
- [Configuration reference](/docs/configuration)
- [Theming reference](/docs/theming)

## License

MIT