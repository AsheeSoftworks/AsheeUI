---
"@asheeui/core": minor
"@asheeui/native": minor
"@asheeui/web": patch
---

Native gains the field family, and the shared layer gains the vocabulary its members
read.

- `@asheeui/native` implements `Textarea`, `SearchInput`, `PinInput`, `Switch`,
  `Radio` with `RadioGroup`, `Dropmenu`, `MultiSelect`, `Autocomplete`, `Form`,
  `Stepper` and `FileUpload`. Each satisfies the contract its web counterpart already
  states and reads the same cascade, the same field vocabulary and the same label
  block; what differs is the platform, and where the platform forces a difference it
  is recorded in the matrix rather than hidden. A code field types into one native
  field behind its boxes, because a native control has a single caret. An
  autocomplete shows its suggestions under the field rather than floating them beside
  it, because a reader comparing what they typed with what it matches has to see both
  at once. A select and a multi-select pick from one surface at a time, because the
  platform has no floating layer, and a file field owns the zone, the list and the
  validation while the consumer wires the platform's own picker to `onChoose`.
- `@asheeui/core` gains the configuration each member shares with the web plus the
  class strings each renderer compiles, native and web side by side: `switch`,
  `textarea`, `radio`, `search-input`, `pin-input`, `form`, `stepper` and
  `file-upload`. It also gains the rule the two platforms share for a code,
  `sanitizePinValue`, so a web field and a native field cannot filter the same input
  differently.
- `@asheeui/web` points its switch, textarea, radio, search-input, pin-input, form,
  stepper and file-upload configuration and style modules at those shared modules, and
  re-exports the code field's rule. The rendered markup and the public props are
  unchanged.
- `docs/native.md` records what shipped, why two members read the platform rather than
  a preference, and why `Calendar` stays queued: a native date field that accepted
  `time` and `datetime` without the platform's time picker would advertise an option
  it ignores. The parity queue shrinks accordingly — `pnpm check:native-parity` now
  reports 23 of 58 promised components implemented.
