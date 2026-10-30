---
"@asheeui/core": major
"asheeui": patch
---

The compatibility matrix moves to `@asheeui/core/dev`, and the ten names no file read are gone.

**The matrix stops being part of the contract.** `PlatformSupport`, `ComponentSupport`,
`COMPONENT_SUPPORT`, `findComponentSupport` and `PLATFORM_SUPPORT_LABEL` are published from
`@asheeui/core/dev` and are no longer on the package root. No name and no value changed: an import
moves from `@asheeui/core` to `@asheeui/core/dev`. The root entry is what a component imports — the
tokens, the rules, the configuration vocabulary — while the matrix is an inventory of that contract
that only a tool reads: the parity guard, the umbrella guard, the documentation's platform table. The
build has two entries, so the published package ships `dist/dev.js` and `dist/dev.d.ts` beside
`dist/index.js`, and `matrix.ts` is no longer in the root entry's module graph. Nothing in this
repository imported the matrix, so no importer needed re-pointing: the docs site pins the published
`@asheeui/core` 2.3.1, and the CLI has no dependency on core at all.

**Ten names are deleted** (`CORE-MIGRATION-REPORT.md` §7.2): the five component contracts that no
file, test or tool read (`TextContract`, `ButtonContract`, `CardContract`, `StackContract`,
`BadgeContract`), the public `_ColorConfigGuards` carrier, the three unused token aliases (`FontSize`,
`FontWeight`, `Elevation`), and `NATIVE_STEPPER_LABEL_CLASS`, which C1 had already moved to
`@asheeui/native` and which no native file reads.

**`contracts.ts` stays until B19, and says so.** Deleting the five does not empty it — `ThemedContract`
(the four axes every themed component offers) and `InputContract` remain — and its prose is what B19's
`PORTABLE_API` will be written from. It carries a `@deprecated` note naming B19 rather than being
deleted here, because `packages/core/src/portable.ts` does not exist yet.

**`_ColorConfigGuards` was load-bearing, so its checks moved rather than died.** It was the exported
carrier that kept two compile-time assertions — "the documented custom-theme declaration compiles" and
"`extends` may name another custom theme" — from being reported as unused aliases. The carrier is gone
with the other nine names; the assertions now live in `packages/web/src/test/custom-theme.test.tsx`,
where the configuration vocabulary is consumed and where `tsc` runs as part of the gate. The first
attempt in this batch deleted only the carrier: `apps/showcase` builds core's source with
`noUnusedLocals` and failed it with `TS6196` on both aliases, which is the evidence that the carrier
mattered and the reason the assertions were not simply deleted with it.

`@asheeui/core` now publishes **270 exports** (279 before this batch, 983 before the shrink) with
`dependencies: {}`, and every export the audit still calls unread is either the vocabulary
`CORE-MIGRATION-REPORT.md` §7.1 lists or a name core's own public signature and suite read.
