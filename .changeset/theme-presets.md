---
"@asheeui/theme": patch
---

Adds starter presets (`THEME_PRESETS`) and gallery preset support (`presets`,
`onPresetSelect`), plus a native smoke test proving the gallery selects a runtime theme through
the native provider. The gallery no longer renders a base badge as a text array on native, which
React Native rejects inside a `View`.
