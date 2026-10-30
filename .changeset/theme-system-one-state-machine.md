---
"@asheeui/core": minor
"@asheeui/web": minor
"@asheeui/native": minor
"asheeui": patch
---

`useTheme`, `themeController`, `THEME_STORAGE_KEY` and `ThemeSelection` exist on both renderers with
one behaviour: the state machine moved to core and each renderer supplies a host.

**One state machine.** `createThemeController(host)` is the web controller's logic, ported without
weakening any of the six rules it documents: the available list only grows, the default theme belongs
to the provider that owns the document, a stale stored value self-heals, only `setTheme` persists,
`toggleTheme` skips `"system"`, and `"system"` resolves through the host and re-resolves when the
platform reports a change. A core test drives a DOM-like host, a device-like host and a host with no
storage through the same script and asserts identical transitions, because a controller that works
only in a browser has been moved rather than ported.

**The web adapter is the host and the singleton.** `packages/web/src/theme/controller.ts` keeps its
exports (`ThemeSelection`, `THEME_STORAGE_KEY`, `ThemeConfigInput`, `themeController`) and now
contains only `matchMedia`, `localStorage` and the document paint; its `controller.test.ts` is
untouched and green, which is the regression proof. Painting moved out of the state machine into the
host because core may not import a DOM.

**The native adapter is `Appearance` plus an injected storage.** `packages/native/src/theme/` supplies
the host, `useTheme()` with the same five fields, and a session store by default. Persistence is the
application's dependency, not the library's: `AsheeUIProvider` takes an optional `persistTheme`
adapter (`get`/`set`/`remove`), and no storage package is installed. The provider configures the
controller and repaints with `vars()` from its subscription; `setTheme` is synchronous.

**The ninth token exists on both, from one constant.** `ON_SOLID_CHANNELS` in core is the ink over a
saturated fill. Web already painted `--color-on-solid: white`; what was missing is that the value
came from a stylesheet literal rather than from the shared constant, and that no `--ashee-on-solid`
was emitted. The theme script now emits it in every theme block, the stylesheet reads it, native's
`paletteVariables` emits it, the Tailwind preset gains `on-solid`, and native's solid text classes
move from `text-background` to `text-on-solid` — so a solid `danger` button reads white on a device
as it already did in a browser.

**The colour resolution was already one function.** `CORE-MIGRATION-REPORT.md` §5 row 5 was closed by
B09: core's `resolveConfig` (the web path) and native's `resolveNativeConfig` both call
`resolveColorConfig` with the same defaults and the same family rule. This release adds the test that
states it — the two resolved configurations yield identical palettes for the built-ins and for a
custom theme that extends one — and reports the row as already closed rather than moving a function
that is already where the plan wanted it.
