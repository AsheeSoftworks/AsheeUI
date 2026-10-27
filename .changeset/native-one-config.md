---
"@asheeui/native": minor
"@asheeui/core": minor
---

One configuration describes both renderers, palette included: the device now paints the
theme the configuration states, and the provider answers to the name the web one uses.

**The palette is the configuration's.** `AsheeNativeProvider` accepts the same `color` and
`defaultTheme` the web renderer does and applies them: `@asheeui/core` resolves the palettes
(it exports `resolveColorConfig` now, with `PALETTE_ROLES`, `colorChannels`, `paletteVariables`
and `selectTheme` beside it), the preset states each role as
`rgb(var(--ashee-<role>) / <alpha-value>)`, and the provider paints those custom properties
with NativeWind's `vars()`. So `bg-primary` names a role rather than a colour: a device and a
browser render one palette from one object, `defaultTheme: "system"` follows the platform's
colour scheme, and a custom theme declared under `color` works on both.

- A role is opaque and must be a hex, `#rgb`/`#rgba` or an `rgb()`/`rgba()` value, because a
  variable in that position holds channels; a value the platform cannot read is an error
  naming the role instead of a surface that paints nothing.
- `defaultTheme` naming a theme the configuration does not declare is an error rather than a
  silent fall back to light.
- The preset no longer states colour values of its own. An application that writes role
  colours in `theme.extend.colors` keeps a build-time palette and has traded the runtime one
  for it, which the docs now say; deleting those lines is what moves it onto the
  configuration's palette.
- The provider claims the height it is given (`flex-1`), because a screen's shell grows into
  the screen; it belongs at the root, where the documentation already put it.

**One root, one configuration type.** `@asheeui/native` exports `AsheeUIProvider`,
`useAsheeConfig` and `AsheeUIProviderProps` beside the platform names, so a shared root reads
the same on both platforms. `asheeui` exports `AsheeConfig` from each branch — `ExternalConfig`
on the web, the native interface on a device — so a configuration file that both platforms
read names one type and compiles for both, while an option only one platform honours stays
refused by the other rather than accepted and ignored.

**Documentation.** The native page's setup now states the palette and theme as part of the
configuration, records that role colours in `tailwind.config.js` override the runtime palette,
and lists that among the causes of an unstyled role.
