---
"@asheeui/native": minor
"@asheeui/web": minor
---

The native renderer composes classes with one `cn` now, and the families a device cannot compile
have a lint of their own.

**`cn` is the name a component uses internally.** The sixty-odd native components that imported
`classNames` now import `cn`; `classNames` remains, at its module path and in the package entry, as
the same function so existing applications keep working and hear the rename once. The merge itself
is unchanged: property families, last one wins, the survivor where the consumer wrote it, variants
are part of the identity, an unmodelled family is kept, and a consumer's `className` beats the
component's — `Button` test proves `bg-danger` replaces `bg-primary` while the `active:` state
survives.

**`pnpm lint:class-vocabulary`.** The new `scripts/lint-class-vocabulary.mjs` scans the shared code
(`packages/ui`, and `apps/showcase/src/shared` when present) for the families in
`NATIVE-IMPOSSIBLE-REPORT.md` §5.4 — the hover/focus/responsive variants, `shadow-*`, `ring-*`,
`transition-*`, `z-*` and the rest — and scans the native dictionaries as a self-check. It reads
string literals and class tokens, not lines, so a dictionary's `sm:` object key and a test's
`"md:"` are not violations. Zero violations in 59 files.

**One real find, fixed.** The self-check found `md:py-12` and friends in the platform's copy of
`SPACE_PADDING_Y_CLASS`: the web's responsive step had been copied into the portable dictionary,
where it compiles to nothing. The platform copy now states the base step, and the parity test's
list says why this one constant is deliberately not character-for-character equal.

**Docs.** `apps/docs/content/platforms/native.md` gains "When a prop does nothing" and "Writing
classes", covering the warning, the config audit, `cn`'s precedence and the lint. (The docs app is
ignored by this repository, so the page is updated locally rather than tracked.)
