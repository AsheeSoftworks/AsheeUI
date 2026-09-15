# Configuration

AsheeUI resolves every visual decision through one cascade, so a value can be
set once globally, per component, or per instance.

## The cascade

```text
instance props            <Button radius="lg" />
        ↓
components.<name>         config.components.button.radius
        ↓
global defaults           config.defaultRadius
        ↓
built-in fallback         the value the component documents
```

The first tier that provides a value wins. A component only ever reads the
resolved value, so overriding one tier never requires touching another.

## The configuration object

Pass a partial configuration to the provider:

```tsx
import { AsheeUIProvider } from "asheeui";

export function Root({ children }) {
  return (
    <AsheeUIProvider
      config={{
        defaultTheme: "system",
        defaultRadius: "md",
        components: {
          button: { radius: "full" },
        },
      }}>
      {children}
    </AsheeUIProvider>
  );
}
```

An independent file works the same way. It is a plain module that exports the
object, and nothing reads it from disk: the application imports it, which is why
no bundler plugin is needed.

```ts
// asheeui.config.ts
import type { ExternalConfig } from "asheeui";

const config: ExternalConfig = {
  defaultTheme: "light",
  defaultRadius: "xs",
};

export default config;
```

A configuration file is optional. The provider falls back to the library
defaults, and an inline object works just as well.

## Global keys

| Key | Type | Meaning |
| --- | --- | --- |
| `color` | colour configuration | Replaces the built-in light and dark palettes |
| `defaultTheme` | `"light"`, `"dark"`, `"system"`, or a theme you defined | Theme applied on first paint |
| `defaultRadius` | size scale | Corner rounding for every component that has a radius |
| `defaultVariant` | variant scale | Visual treatment for every component that has variants |
| `defaultColor` | colour scale | Accent colour for every component that has one |
| `components` | per-component object | Component-level defaults, keyed by component name |

## Component keys

`components` accepts one entry per component, named after the component in
lower camel case, and each entry takes the same axes the component exposes as
props:

```tsx
config={{
  components: {
    button: { radius: "lg", variant: "bordered" },
    badge: { size: "sm", color: "success" },
    alert: { type: "warning" },
  },
}}
```

## The theme system

The provider applies the resolved theme as a class on the document root
(`theme-light`, `theme-dark`, or `theme-<name>` for a theme you defined) and
writes the theme's colours into CSS custom properties (`--ashee-background`,
`--ashee-primary`, and so on). It does that before the first paint, so a page
never flashes the wrong theme.

| Export | Purpose |
| --- | --- |
| `useTheme` | Reads the current theme and changes it |
| `themeController` | The same operations outside React |
| `THEME_STORAGE_KEY` | The `localStorage` key the preference is stored under |

A `defaultTheme` of `"system"` follows the operating system preference and
keeps following it while it changes. A theme name is only applied when the
configuration defines a CSS block for it.

## Scrollbars

Scrollbar theming is configuration rather than a component. Set it under
`components.scrollbar`:

```tsx
config={{
  components: {
    scrollbar: { width: "12px", radius: "8px", thumbBorder: "2px" },
  },
}}
```

| Key | Meaning |
| --- | --- |
| `width` | Thickness of the scrollbar |
| `radius` | Corner rounding of the thumb |
| `trackRadius` | Rounding of the track; falls back to `radius` |
| `thumbBorder` | Breathing room between the thumb and the track, drawn as a transparent border |
| `gutter` | The native `scrollbar-gutter` value |

## Validation

Configuration is validated once per provider mount, so a mistake is reported
rather than silently replaced:

- an invalid value throws while the provider renders, naming the key and the
  value;
- an unknown key warns in development and stays silent in production, because a
  stray key is usually a typo rather than a reason to take an application down.

## Next

- [Components](./components.md) for the shared prop axes and the substitution API.
- [Accessibility](./accessibility.md) for the behaviour the framework guarantees.
- [Migration](./migration.md) for the policy in force from 1.0.
