---
"@asheeui/core": major
"@asheeui/web": minor
"@asheeui/native": minor
---

The eight mixed modules are split, and the last class string leaves `@asheeui/core`.

**The eight files no longer carry two layers.** C1 and C2 had already taken the dictionaries out of
most of them; C3 settled the residue and wrote down the owner of every symbol that stayed, in the
file, as a one-line reason. `shared/radius`, `shared/spacing`, `shared/variant`, `shared/message-surface`,
`shared/typography` and `utils/resolve-token` are now vocabulary and rules — the unions the
configuration is written in, `UnderlineRadius`, `resolveMessageVariant`, the cascade resolvers — with
each renderer's strings named and pointed at. `theme/palette` and `shared/variant` needed no change
and say so.

**Three moves out of core.**

- `TYPOGRAPHY_ROLE_DEFAULT_ELEMENT` → `@asheeui/web`. It names a DOM element, and the platform draws
  a `Text` for every role. The role *table* (`TYPOGRAPHY_ROLE_TOKEN`, `TypographyRoleTokens`) and the
  six `TYPOGRAPHY_*_VALUES` arrays stay: they are the vocabulary and the treatment B15 makes the
  platform read.
- `SECTION_BLOCK_TEXT_ALIGN` → `@asheeui/native`. It states which side a `Text` is aligned to, and
  only a `Text` takes it; the web aligns the heading block once, with a class.
- The toast's `PLACEMENT_CLASSES` and `TOAST_ANIMATION_STATE`, the calendar's `CALENDAR_COLOR_CLASSES`
  and the marquee's `MARQUEE_FALLBACK_GAP` followed the renderer that reads them — web for the first
  three, native for the last. `@asheeui/core` now holds **no class string and no class map at all**,
  which is what C2 promised and this batch delivers: nothing in core matches
  `^export const [A-Z0-9_]*CLASS(ES)?`.

**One move the report did not predict.** `STEPPER_LABEL_SIZE_TOKEN` is web's, not shared: the platform
answers the same question one typography role higher in `NATIVE_STEPPER_LABEL_ROLE`, because a native
marker is a touch target rather than a badge, so there is no one map both renderers could read.

**What stays in core, and why, in the file.** `TOAST_TYPE_COLOR`, `ALERT_TYPE_COLOR`,
`ALERT_TYPE_ROLE` and `MARQUEE_SPEED_PRESETS` are read by both renderers and are decisions — a role, an
urgency, a duration — rather than drawings. `AVATAR_FALLBACK_VARIANT` names a value of the shared
`Variant` union. `TypographyRoleTokens`, `TYPOGRAPHY_ROLE_TOKEN`, `SECTION_BLOCK_HEADING_ROLE`,
`SectionBlockOptions`, `StepperStepState` and the four section-block types are the configuration
vocabulary, and a type never moves (H17).

**C2's emptied module is gone.** `components/forms/calendar/calendar-styles.ts` held only
`CALENDAR_COLOR_CLASSES`, so the move deleted it and its three barrel lines rather than leaving a module
that exports nothing.

**What a consumer does about it:** the seven moved names are published by the renderer they moved to,
under the same names, so an import changes package and nothing else. `B24`'s migration guide lists every
moved family with its new home.
