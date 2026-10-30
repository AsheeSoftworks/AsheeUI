---
"@asheeui/native": minor
---

The platform's fallbacks and defaults answer to the names the web renderer publishes, and the
configuration module's internals leave the entry.

**116 shared spellings.** Every `FALLBACK_NATIVE_X_CONFIG` now also answers to `FALLBACK_X_CONFIG`,
and every `defaultNativeXConfig` to `defaultXConfig` — the same references, in one table
(`config/shared-config-names.ts`), so a shared configuration, a shared test or a generated document
writes one spelling on both renderers. The value stays the platform's (`LAW-2`): a native button still
defaults to density `lg` because a thumb needs the room, where the web's `md` is sized for a pointer.
Every platform spelling now carries `@deprecated` naming the shared one. When they go, the table goes
with them and each component module keeps the declaration it already owns — which is why the table
holds no value of its own.

**The configuration module's internals left the entry.** `NativeConfig` (what a component reads *after*
resolution), `NativePlatformConfig`, `NativeComponentsConfig` and `NATIVE_FALLBACK_CONFIG` are still
exported by `config/resolve-config.ts` and are no longer re-exported by `@asheeui/native`. Nothing
outside the package can use a resolved configuration, so publishing them made an implementation detail
a contract — and nothing in this repository imported them through the entry. `AsheeConfig`,
`NativeExternalConfig` and `resolveNativeConfig` stay: the first is what a consumer's configuration
file is typed with, the second is the platform's shape of it, and the third is what a root passes the
configuration through. `ExternalConfig` and the shared vocabulary arrived in the previous release of
this work; the shared resolver follows in the configuration step.

The umbrella shows the effect: names both branches offer went from **284 to 394**, and the
web-only-internals count from **162 to 52**. The public web-only list is unchanged — what is left there
is the web's own surface, not names native could adopt without new work.
