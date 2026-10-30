---
"@asheeui/core": patch
---

The core charter is a guard now, and the package says what core is for.

**`pnpm check:core-charter`** runs in CI after the native parity check and asserts the four rules the
shrink exists to leave behind: no exported class string, `dependencies: {}`, no renderer, DOM or
styling-engine import, and no export that no renderer, package, script or test reads. It reads
`packages/core/src` as data — the same way the parity and umbrella guards read the matrix — so it
needs no build and cannot verify a stale artifact.

**The rule is written down where a contributor meets it.** The module doc of `@asheeui/core` now
opens with the charter in three sentences — *a thing belongs in core only if it is true on both
platforms and cannot be expressed per-renderer without the two drifting* — and the documentation's
React Native page gains a "Where styling lives" section: each renderer owns its class strings, core
owns the tokens, the rules and the types, and the 21 strings both compile are the documented,
parity-tested exception.

**The guard was proved to fail before it was trusted.** A throwaway
`export const X_CLASS = "bg-primary text-foreground"`, a value `react` import, a `clsx` import, two
unread exports and a temporary `clsx` dependency were each reported at their file and line, then
removed; the batch report records the output. The allow-list is the vocabulary
`CORE-MIGRATION-REPORT.md` §7.1 records, pruned of the four names the shrink moved out of core
(`colorChannels`, `SPACE_BLOCK_CLASS`, `establishesStackingContext`, `resolveFloatingZIndex`), and
the guard prints any allow-list entry core stops exporting so the list cannot rot silently.

No API changed. The patch is for the module documentation, which ships in the package's declarations,
and for the two script files that ship with the repository rather than the package.
