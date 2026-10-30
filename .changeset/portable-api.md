---
"@asheeui/core": minor
---

Declare `PORTABLE_API`, the names `asheeui` offers on both platforms.

The umbrella used to be `export *` over each renderer, so it offered the union — 791 names on the
web branch and 1053 on the native one — and a shared file compiled against names the other platform
does not have. `PORTABLE_API` states the intersection once, in core: every name, whether it is a
component, provider, hook, helper, type or constant, the matrix classification it inherits, and the
package that publishes it (`source`). A `pending` list ratchets names that are not portable yet.

`contracts.ts` is retired with this change. `Substitution` and `LinkSubstitution` — the only part a
renderer still reads — move to `shared/substitution.ts`; `ThemedContract` and `InputContract` had no
reader and are deleted. The module's prose now documents `portable.ts`.
