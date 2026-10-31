# @asheeui/theme

Optional theme editing UI for [AsheeUI](https://asheeui.com). It renders on the web and on React
Native because it is composed from `asheeui`; it does not import either renderer.

The application still owns the theme definitions and their persistence. This package edits and
displays them.

## Install

```bash
pnpm add @asheeui/theme
```

`asheeui`, `@asheeui/core` and `react` are peers.

## Switch themes

```tsx
import { ThemeSwitcher } from "@asheeui/theme";

<ThemeSwitcher showSystem label="Appearance" />;
```

The switcher lists the built-ins, the themes declared in `config.color` and the runtime names the
provider has been given. It calls `useTheme().setTheme`, so the existing `ashee-theme` persistence
applies.

## Edit a theme

```tsx
import { ThemeEditor } from "@asheeui/theme";
import type { ExternalColorConfig } from "@asheeui/core";
import { useState } from "react";

const [themes, setThemes] = useState<ExternalColorConfig>({});

<ThemeEditor
  themes={themes}
  onChange={setThemes}
  onApply={(name) => setTheme(name)}
/>;
```

The editor is controlled: it never wraps a provider, calls `setTheme` or writes storage. It emits a
complete map; the application persists it and passes it to `AsheeUIProvider themes={...}`.

`ThemeGallery` renders saved themes with create/edit/delete actions, `ThemeCard` previews one
palette, and `ColorField`/`ContrastBadge` are the building blocks if an application wants its own
form.

## Starter presets

`THEME_PRESETS` is a small set of ready definitions; the gallery can offer them without saving
anything itself:

```tsx
import { THEME_PRESETS, ThemeGallery } from "@asheeui/theme";

<ThemeGallery
  themes={themes}
  presets={THEME_PRESETS}
  onPresetSelect={(preset) => {
    setThemes({ ...themes, [preset.slug]: preset.definition });
  }}
/>;
```

The application decides whether a preset replaces an existing theme or is added beside it. Select
it on the next render, after the provider knows the name.

## Rules the editor follows

- `light`, `dark` and `system` are reserved; retune the built-ins in `config.color`.
- A runtime name is a lowercase slug derived from the display name.
- Colours are hex or `rgb()`/`rgba()`, the intersection both renderers can paint.
- Alpha is dropped, matching the palette roles.
- Deleting the active theme falls back to the configured default; the application decides when to
  call `setTheme`.

See the [AsheeUI theming guide](https://asheeui.com/guides/) for the provider side.
