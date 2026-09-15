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

## Layout and pattern keys

The layout and pattern components resolve their whole option set through the same
cascade, so an application states its page structure once:

```tsx
config={{
  components: {
    container: { size: "xl" },
    section: { spacing: "xl" },
    stack: { gap: "lg" },
    grid: { gap: "lg", align: "stretch" },
    page: { containerSize: "xl", sticky: true },
    navbar: { variant: "bordered", align: "center" },
    hero: { align: "center", spacing: "xl" },
    footer: { variant: "muted" },
  },
}}
```

| Key | Options |
| --- | --- |
| `container` | `size`, `gutter`, `centered` |
| `section` | `spacing`, `background`, `contained`, `containerSize`, `divider` |
| `stack` | `direction`, `gap`, `align`, `justify`, `wrap` |
| `grid` | `columns`, `columnsMd`, `columnsLg`, `gap`, `align` |
| `page` | `contained`, `containerSize`, `spacing`, `sticky`, `divider` |
| `sidebarlayout` | `side`, `sidebarWidth`, `stickySidebar` |
| `authlayout` | `panel`, `align`, `mediaPosition`, `contentSize` |
| `hero` | `align`, `spacing`, `background`, `mediaPosition`, `containerSize`, `contained` |
| `cta` | `align`, `spacing`, `background`, `panel`, `containerSize`, `contained` |
| `featuregrid` | `columns`, `columnsMd`, `columnsLg`, `gap`, `spacing`, `background`, `align`, `containerSize`, `contained` |
| `testimonials` | the same options as `featuregrid` |
| `pricingcard` | `variant`, `size`, `highlighted` |
| `navbar` | `position`, `variant`, `align`, `contained`, `containerSize` |
| `footer` | `variant`, `spacing`, `contained`, `containerSize` |
| `emptystate` | `type`, `size`, `panel` |
| `pininput` | `length`, `mode`, `size`, `masked`, `radius`, `isDisabled`, `isInvalid` |
| `clipboard` | `timeout`, `label`, `copiedLabel`, `variant`, `color`, `size`, `radius` |
| `centered` | `axis`, `minHeight`, `contained`, `containerSize` |
| `split` | `stackAt`, `ratio`, `gap`, `align`, `divider`, `stickyEnd` |
| `marketinglayout` | `skipLink`, `skipLinkLabel`, `background` |
| `docslayout` | `navigationLabel`, `tocLabel`, `navigationWidth`, `stickyToc`, `skipLink`, `skipLinkLabel` |
| `searchinput` | `size`, `color`, `clearable`, `label`, `hideLabel` |
| `stepper` | `orientation`, `size`, `showDescriptions` |
| `datatable` | `searchable`, `searchLabel`, `paginated`, `pageSize`, `showRowCount`, `emptyTitle`, `emptyDescription` |
| `loadingstate` | `label`, `size`, `panel`, `minHeight` |
| `errorstate` | `size`, `panel`, `role`, `retryLabel`, `detailLabel` |
| `fileupload` | `buttonLabel`, `hint`, `size` |

`grid` is the one entry where an unstated breakpoint is a deliberate value: a
`columnsLg` you never set inherits `columnsMd`, which inherits `columns`, so a
grid that never changes shape only states `columns`.

## Next

- [Components](./components.md) for the shared prop axes and the substitution API.
- [Accessibility](./accessibility.md) for the behaviour the framework guarantees.
- [Puck](./puck.md) for the block configuration built on these keys.
- [Migration](./migration.md) for the policy in force from 1.0.
