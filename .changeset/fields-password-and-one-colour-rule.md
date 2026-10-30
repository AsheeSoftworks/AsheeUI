---
"@asheeui/native": minor
"@asheeui/web": patch
"@asheeui/core": patch
---

A native field honours the web's `type`, the field family gains the web's slots and options, and
`PasswordInput` exists on both renderers.

**`type` is translated, not forwarded.** A browser changes the control it renders for
`type="password"`; a platform has no such attribute, so native `Input` maps the value to the
platform's own props: `password` becomes `secureTextEntry` with the password autofill vocabulary,
and `email`, `tel`, `number`, `url` and `search` state the keyboard and autofill hint a device
understands. A value the table does not know warns once in development rather than rendering an
ordinary text field with no explanation. The masking is asserted through `secureTextEntry`, which is
the platform mechanism, not through a style.

**`PasswordInput` mirrors the web component.** The reveal control carries
`accessibilityLabel={toggleAriaLabel(...)}` and `accessibilityState={{ selected }}`, accepts
`offIcon`/`onIcon` as `ReactNode`, and switches between the masked and plain field. It is exported by
both renderers and classified `shared`, so `pnpm check:native-parity` is now 59 of 59 with the queue
still empty.

**The field family accepts the web's slots and options.** `startContent`/`endContent` on `Input`,
`Textarea` and `SearchInput`; `isLoading` on `Input` (the switch already had it); `fullWidth`,
`required` and `labelAlign` on the field's wrapper and shell. `labelAlign` is drawn by the shared
field shell rather than ignored, and `fullWidth={false}` sizes the field to its content. Anything the
shared contract still accepts and the platform does not is B17's ledger, and no warning here claims
otherwise.

**Two field rules are now one on both renderers.** Native `Input` resolves the colour *role* through
core's `resolveFieldStatusColor` and then maps that role to its own edge class, so `status="error"`,
`"warning"` and `"success"` take the same role on a device as in a browser — the platform used to
ignore the last two. `Color` is canonical in core and `ColorRole` is a deprecated type alias of it;
native's imports and annotations now write `Color`, and a both-ways assignability test proves the two
are one union.

`CORE-MIGRATION-REPORT.md` §5 rows 10 and 11 are closed.
