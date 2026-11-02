---
"@asheeui/theme": patch
---

Labels a theme slug as a readable name in `ThemeSwitcher`: `lagoon` becomes `Lagoon`, and a
hyphenated slug becomes words. The stored key and the `setTheme` value stay the slug. `ThemeEditor`
now renders **Save & apply** only when it receives `onApply`, so a preview-only editor cannot show
a control that does nothing.
