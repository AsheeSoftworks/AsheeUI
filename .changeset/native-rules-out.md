---
"@asheeui/core": major
"@asheeui/native": minor
---

The three native-only rules leave `@asheeui/core`: the spinner's duration, the announcement
mapping, and the palette's channel conversion.

**`resolveSpinnerDurationMs`** is now `native/src/components/feedback/spinner/resolve-duration.ts`.
The web states a speed as a CSS duration and hands it to the animation; a platform animator counts
milliseconds, so the parse is the platform's own. The speed itself — `SPINNER_FALLBACK_SPEED` and
the `speed` option of `components.spinner` — stays in core, because both renderers read it.

**`resolveNativeAnnouncementRole` and `NATIVE_ANNOUNCEMENT_LIVE_REGION`** are now
`native/src/shared/announcement.ts`. The *level* (`"alert"` or `"status"`, typed by
`AnnouncementRole`) is shared and stays in core; the *mechanism* is not: the web writes the level as
a live-region role inline, while the platform states it as a politeness plus a role of its own. B16
makes the web read this same mapping.

**`colorChannels` and `paletteVariables`** are now `native/src/theme/palette.ts`, with the reason
the conversion is not shared stated in the module: NativeWind reads a colour as
`rgb(var(--x) / <alpha-value>)`, so a theme variable has to hold **channels**, while a browser
resolves alpha itself (`bg-primary/40`) and never needs them. `PALETTE_ROLES`, `PaletteRole`,
`PaletteVariable`, `ColorScheme` and `selectTheme` stay in core — the palette model and the theme
choice are the same on both renderers, and B11 unifies the resolution that reads them.

Their tests moved with them: `palette.test.ts` lost the two conversion suites and kept
`selectTheme`'s, `spinner-config.test.ts` kept the speed's one, and
`native/src/shared/announcement.test.ts` follows its module. `@asheeui/core` publishes 582 exports,
four fewer than the previous commit and 401 fewer than before the shrink began; the remaining
native-only names are the §5 "unify, do not move" list and the types, which do not move.
