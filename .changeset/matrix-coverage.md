---
"@asheeui/core": patch
---

The compatibility matrix classifies every public component the web package publishes.

`NATIVE-PARITY-REPORT.md` §F13's coverage assertion is now part of `pnpm check:native-parity`:
the guard parses the web package's `"."` and `"./section-kit"` entries and fails when a public
component has no matrix entry. The matrix gains the section kit (`ActionGroup`, `SectionHeading`,
`SkipLink`), the provider (`AsheeUIProvider`) and `CopyButton`; `SkipLink` is `web-only`. A component
that lives on a subpath carries a new `subpath` field, so the umbrella's root-surface assertion does
not claim it.

Exports that are aliases or parts of a bigger module (`Text` → `Typography`, `HStack` → `Stack`,
`PageHeader` → `Page`, …) are declared in `scripts/matrix-coverage.json`; the guard fails when one
points at a module the matrix does not have, or at an export the package no longer publishes.
`packages/core/src/matrix.test.ts` calls the same evaluator, so the suite and the guard cannot
disagree.
