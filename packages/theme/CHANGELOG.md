# @asheeui/theme

## 0.1.2

### Patch Changes

- 8873ad0: Labels a theme slug as a readable name in `ThemeSwitcher`: `lagoon` becomes `Lagoon`, and a
  hyphenated slug becomes words. The stored key and the `setTheme` value stay the slug. `ThemeEditor`
  now renders **Save & apply** only when it receives `onApply`, so a preview-only editor cannot show
  a control that does nothing.

## 0.1.1

### Patch Changes

- b18581f: Adds starter presets (`THEME_PRESETS`) and gallery preset support (`presets`,
  `onPresetSelect`), plus a native smoke test proving the gallery selects a runtime theme through
  the native provider. The gallery no longer renders a base badge as a text array on native, which
  React Native rejects inside a `View`.

## 0.1.0

### Minor Changes

- b357415: Initial release. `@asheeui/theme` is the optional editing layer over the portable
  components: `ColorField`, `ContrastBadge`, `ThemeCard`, `ThemeSwitcher`, `ThemeGallery` and
  `ThemeEditor`. Every component is controlled and imports `asheeui`; the application keeps the
  `themes` state, passes it to the provider and persists it. The package also exports the slug and
  reserved-name helpers the editor uses.

### Patch Changes

- Updated dependencies [22c58b4]
- Updated dependencies [b357415]
  - @asheeui/core@3.1.0
  - asheeui@3.1.0
