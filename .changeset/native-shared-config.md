---
"@asheeui/native": patch
---

`AsheeNativeProvider` accepts the web renderer's configuration type, so one configuration
object describes both renderers without a per-platform type.

`NativeExternalConfig` now extends `@asheeui/core`'s `ExternalConfig` — the type
`@asheeui/web` takes — and adds only what the platform has on its own: `defaultSize`, and the
component sections the web renderer declares in its own package rather than in the core
(`card`, `typography`, `container`, the field family and the layout ones). A configuration
typed `ExternalConfig` is therefore accepted here unchanged, and `AsheeConfig` is that same
type under the name `asheeui` resolves per platform.

A native-only installation still configures every section it has, because those sections are
added by this package; an unknown section, or a key spelled the export's way rather than the
registration's (`searchInput` for `searchinput`), is still refused by the type checker.
