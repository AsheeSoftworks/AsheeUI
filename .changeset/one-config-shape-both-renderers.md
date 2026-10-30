---
"@asheeui/native": minor
"@asheeui/core": patch
---

`useAsheeConfig()` returns the same configuration shape on the device as on the web, and an invalid
configuration now fails the same way on both.

**The native resolved configuration is core's `Config` plus the platform's density.** It gains
`color` (the resolved palettes, every theme filled in from the one it extends) and `defaultTheme` (the
theme the configuration asks for, `"system"` by default), so a shared component reads
`config.defaultTheme`, `config.color` and `config.defaultVariant` and means the same thing on either
platform. `defaultSize` stays the platform-only addition, because a pointer and a thumb want different
baselines. A native test asserts the assignability to core's `Config`, so a field that goes missing
fails to compile.

**The palette is resolved once.** The provider paints the `color` the resolver produced instead of
resolving the theme a second time, and it now applies the same "a custom theme with no `extends`
inherits the configured theme family" rule the web applies — a device whose application defaults to
dark no longer gets a light-based custom theme.

**`useAshee` exists on both renderers.** It was the web's alias alone; the platform publishes it as
the same reference as `useAsheeConfig`.

**The resolve/merge/validate trio is one path.** Both providers call core's `assertValidConfig`, and
both resolvers merge with core's `mergeObject` (the web's already did), so one invalid shared
configuration object is rejected with the one message core states. The platform's own key,
`defaultSize`, is taken out before the shared validator sees the object, so stating it is not reported
as an unknown key. What remains per platform is documented at the top of each resolver: the values.

`CORE-MIGRATION-REPORT.md` §5 rows 2, 3 and 4 are closed. The core patch is for that documentation,
which ships in the package's declarations.
