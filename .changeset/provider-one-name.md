---
"@asheeui/native": minor
"@asheeui/puck": patch
---

The provider answers to the web renderer's names: `AsheeUIProvider`, `AsheeUIProviderProps`,
`AsheeConfigContext` and `useAsheeConfig` are now the declarations, and the platform-suffixed
spellings are deprecated aliases of the same references.

A shared component writes one root and reads one configuration, and the names it writes have to be
the same names on both platforms — that is what makes it shared. `@asheeui/web` already published
`AsheeUIProvider`, `AsheeUIProviderProps`, `AsheeConfigContext` and `useAsheeConfig`; the native
renderer published the same four concepts as `AsheeNative*`. The direction of the rename matters: the
shared name is canonical and the platform's spelling is the alias, never the reverse, so the debt
shrinks instead of compounding.

**The old names keep working, and they are the same references.** `AsheeNativeProvider` is
`deprecatedAlias(AsheeUIProvider)` — the value itself, not a wrapper — so
`AsheeNativeProvider === AsheeUIProvider` holds and a test asserts it, along with the context and the
hook. A wrapper would satisfy the compiler and then drift the first time one of them gained a
property the other lacked.

**One warning, four names, once per process, outside production only.** The module announces the move
with a single `deprecateMany` call listing every name it moved, because a consumer reading it sees one
decision rather than four to weigh separately. Because the announcement is made by the module when it
is loaded, importing the package in development prints it once even if the canonical names are the
only ones used — that is the trade: the names are announced together, and nothing warns per render or
per use.

**The framework's own code speaks the canonical names.** Every internal import in `@asheeui/native`
(118 files) and `@asheeui/puck`'s native shell and renderer test now write `useAsheeConfig` and
`AsheeUIProvider`, which is the proof the alias is not load-bearing. The module's file is
`provider/AsheeUIProvider.tsx`, and the provider folder has a barrel, so the public surface is the
package's entry rather than a file path.

**The umbrella's shared surface grew by one.** `AsheeConfigContext` existed only on the web branch
before; both branches publish it now, which is one fewer name a shared component can find on the web
and not on a device.
