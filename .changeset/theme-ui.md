---
"@asheeui/core": minor
"@asheeui/web": minor
"@asheeui/native": minor
"asheeui": minor
"@asheeui/theme": minor
---

Adds `ColorSwatch` to both renderers and the umbrella, plus the colour parsing and WCAG contrast
helpers the theme UI needs. Introduces `@asheeui/theme`, the optional editing layer: `ColorField`,
`ThemeSwitcher`, `ThemeCard`, `ThemeEditor`, `ThemeGallery` and `ContrastBadge`, all controlled and
built on `asheeui` so the same source runs on web and native. `useTheme().availableThemes` now has
its own external-store snapshot, so a provider's initial theme list reaches the first render.
