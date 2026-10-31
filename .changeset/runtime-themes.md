---
"@asheeui/core": minor
"@asheeui/web": minor
"@asheeui/native": minor
"asheeui": minor
---

Add a `themes` prop to both providers for runtime themes.

`AsheeUIProvider` now accepts `themes?: ExternalColorConfig`, merged over `config.color` before
resolution. A palette created while the application runs therefore goes through the same `extends`
resolution, validation and painting as a configured one: the web registers a new `theme-<name>` block,
the device repaints the subtree through `paletteVariables`, and the controller lists the name for
`useTheme().setTheme`. Removing a name removes it from the picker and falls back when it was selected.

Runtime names are validated as lowercase slugs, `light`/`dark`/`system` are reserved, colours are
restricted to the portable hex/rgb set a device can apply, and `extends` must name a declared theme.
The controller now accepts owner-scoped theme contributions so a provider's list can shrink without
breaking the nested-provider union rule, and `releaseThemes` removes a provider's contribution when it
unmounts.
