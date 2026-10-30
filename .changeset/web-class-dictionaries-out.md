---
"@asheeui/core": major
"@asheeui/web": minor
"asheeui": patch
---

The web renderer's class dictionaries move out of `@asheeui/core` and into `@asheeui/web`.

**266 class constants, 52 modules.** Every string Tailwind compiles for the browser was declared in
core beside the platform's own strings, in 34 files. Core is the shared contract, and a class string
states a decision about pixels the two platforms do not share — so the web's dictionaries now live in
`packages/web/src/styles/`, one module per component, and are published by `@asheeui/web`. **No name
and no value changed**: every constant is the one core published, character for character, and the
imports that read them were rewritten in the same commit. A core style file with nothing left to
export is deleted; the files that still hold a shared string, a token or a rule stay.

**The vocabulary moves to core's token layer.** `config/validate-config.ts` used to enumerate a
consumer's configuration against the web's class maps (`RADIUS_CLASS`, `TYPOGRAPHY_*_CLASS`), which
is why the validator could only live in a package that held a renderer. It now reads the design
language: `TYPOGRAPHY_SIZE_VALUES`, `TYPOGRAPHY_WEIGHT_VALUES`, `TYPOGRAPHY_LEADING_VALUES`,
`TYPOGRAPHY_TRACKING_VALUES`, `TYPOGRAPHY_TONE_VALUES` and `TYPOGRAPHY_ALIGN_VALUES` are declared in
`shared/typography.ts` with their unions derived from them, so a value is valid because the framework
names it, not because a stylesheet compiled it. The radius check reads `RADIUS_STEP`.

**The agreements that spanned both renderers are still asserted.** Twenty-seven core style tests
stated both maps side by side; after the move no package could import both, so each assertion went to
the suite that owns the string it states — and the invariants that were *about* the pair (the same
variant keys, the same colour tokens, the same padding on a shared step, the web's danger edge and
the platform's being one token) moved to `packages/core/src/shared/style-parity.test.ts`, which reads
both `styles/` directories as text. That is the pattern §6.2 of `CORE-MIGRATION-REPORT.md` prescribes
for the strings both renderers compile; a class map is literals, so a text comparison is enough, and
neither package has to depend on the other.

**A consumer imports the same names from the renderer.** `BUTTON_SIZE_CLASS` and the rest were public
from `@asheeui/core`; they are public from `@asheeui/web` now, and this package's entry exports
`./styles`, so the migration is one changed import. `B24`'s guide lists every moved family.

**What stays.** The 21 class strings both renderers compile (`SPACE_GAP_CLASS`, `LINK_SIZE_CLASS`,
`TABS_FONT_CLASS`, …), every token, every rule (`UnderlineRadius`, `resolveGridColumns`,
`resolveCardVariant`, `resolveFieldStatusColor`, `isFieldInvalid`, `selectTheme`, `mergeObject`) and
every type. `cn`, the variant maps, `resolveAnimate`, the stacking helpers and the nine per-component
fallbacks are C2.2's, with the duplication of the 21 and core's dependency removal.
