---
"@asheeui/core": minor
"@asheeui/native": minor
---

Native gains `Calendar`, which is the last member of the field family, and the shared layer
gains the class strings its field's trigger is built from.

- `@asheeui/native` implements `Calendar`: a date, time or datetime field that satisfies the
  contract its web counterpart already states, resolves the same cascade and draws the same
  label block. What the platform forces is drawn and recorded rather than ignored. The field
  opens its calendar on one surface at a time, because the platform has no floating layer for
  a panel beside a control, and the time is stepped through columns rather than typed or
  picked from a platform clock, because a platform time picker takes a colour *value* while
  the contract names a colour *role*, and a control that cannot resolve the role would accept
  the prop and ignore it. Everything that is not the platform's is read from `@asheeui/core`:
  the month grid, the written form of a chosen date, the two rules that decide which cells a
  reader may reach (`isFutureDay` and `canGoToNextMonth`), and the vocabulary an empty field
  speaks — so a day the web refuses is a day native refuses, and a field that is cleared,
  disabled or marked invalid reports the same thing on both platforms.
- `@asheeui/core` gains the class strings the native calendar field's trigger is built
  from: the trigger itself, the row that holds its glyph and its clear control, the clear
  control, and the clear control's label. They sit beside the surface classes the calendar
  module already carried, so the class strings both renderers compile are still one module
  rather than two lists that drift apart.
- `docs/native.md` records what shipped and why two of the calendar's behaviours are the
  platform's rather than a preference. The parity queue shrinks accordingly —
  `pnpm check:native-parity` now reports 24 of 58 promised components implemented.
