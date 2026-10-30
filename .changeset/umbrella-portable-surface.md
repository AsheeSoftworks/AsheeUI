---
"asheeui": major
---

The umbrella is the intersection now, not the union.

`asheeui` used to be `export *` over each renderer, so it offered 791 names on the web branch and 1053
on the native one. Both entries are now generated from `PORTABLE_API` in `@asheeui/core` and publish
the same 181 portable names (plus the platform-specific `AsheeConfig` type), so a name that is
missing on one platform is a compile error rather than `undefined` at runtime.

**Breaking.** Code that imported a web-only name through `asheeui` — `Breadcrumb` and the keyboard
family, for example — must import it from `@asheeui/web`; a native-only name such as `RowList` or
`TabBar` must come from `@asheeui/native`. The extras rule is `UMBRELLA-REPORT.md` §3.5: platform
extras stay with the renderer that owns them, and the umbrella offers only what both offer.

The umbrella's `Text` is no longer an alias the umbrella states: both renderers export `Text`, so the
generated entry re-exports it and `Typography` separately, as the renderers do.

`resolveAnimate` joins `@asheeui/native` so the name is portable on both branches; the native
implementation is the same three-line precedence rule, stated in the renderer that resolves it.
