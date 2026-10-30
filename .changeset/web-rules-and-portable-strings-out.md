---
"@asheeui/core": major
"@asheeui/web": minor
---

The last of the web renderer's rules leave `@asheeui/core`, the 21 portable class strings are
duplicated into both renderers, and core stops having a dependency.

**`cn` is the web renderer's**, in `web/src/utils/cn.ts`, with `clsx` and `tailwind-merge` moving
from core's `package.json` to web's — they were already web's dependencies, so nothing new is
installed. `ASHEE_LAYER`, `ASHEE_GLOBAL_LAYER`, `resolveBaseZIndex`, `resolveFloatingZIndex` and
`establishesStackingContext` move with it as `web/src/utils/stacking.ts`; `resolveAnimate` to
`web/src/utils/resolve-animate.ts`; `parseDateString` to `web/src/utils/parse-date.ts`;
`resolveVariantClass` and the variant class maps to `web/src/shared/variant.ts`. `@asheeui/web`'s
entry publishes all of them, so a consumer's import changes package and nothing else.

**The 22 strings both renderers compile are duplicated, not shared.** `SPACE_GAP_CLASS`,
`LINK_SIZE_CLASS`, `TABS_FONT_CLASS`, `DATA_TABLE_ROW_COUNT_LABEL` and the rest are now stated once
in `web/src/styles/portable.ts` and once in `native/src/styles/portable.ts`, and deleted from core —
which is what lets core hold **no class string at all**. `core/src/shared/style-parity.test.ts`
reads both files and fails when a pair stops matching, so the copies cannot drift.

**Five last constants join the renderer that compiles them:** `CHIP_PRESSABLE_CLASS`,
`MARQUEE_SET_SPACING`, `TABLE_COLOR_STYLES`, `DRAWER_ANIMATION_STATE` and
`SECTION_BLOCK_HEADING_ELEMENT`.

**What stays in core, deliberately:** `UnderlineRadius` and `resolveGridColumns` (the rules both
platforms will apply), `resolveFieldStatusColor` and `isFieldInvalid` (B12), `selectTheme`,
`resolveConfig`/`assertValidConfig` and the registry functions (B08/B09), and the typography role
tables (B15). They are the §5 "unify, do not move" list, and the platform adopts each in the batch
that needs it.

`@asheeui/core` now declares **no dependencies**, publishes 286 exports (983 before the shrink), and
its package weight is tokens, types, the cascade, the configuration pipeline and the matrix.
