---
"@asheeui/core": minor
"@asheeui/native": minor
"@asheeui/web": patch
---

A layer on a device always has a visible way out, and a result a reader cannot see is spoken.

**A close control on both layers.** Native `Modal` and `Drawer` accept `closeLabel` and draw the
built-in close control the web already draws (`CLOSE_LABEL` is core's word for it). The backdrop
press and the platform's own way out stay; the control is additive, and it is what makes a
`transparent` modal with `closeOnBackdropClick={false}` dismissible at all.

**One announcement contract.** Core exports `announce(message, level)`, `ANNOUNCEMENT_ROLE`, and the
host a renderer installs. The platform installs `AccessibilityInfo.announceForAccessibility`; a
browser keeps its live region, because the region is what a browser announces with and there is
nothing for an imperative call to add. `Clipboard`, `Toast`, `Form` and `Calendar` use it, so the
copy result, the message, a refused submit and a month change are heard rather than only shown.

**A refused submit places the reader.** `setAccessibilityFocus(ref)` is the platform's helper — it
needs a native node handle, which is why it is native's — and `Form` calls it, with an alert-level
announcement, when a consumer's `onSubmit` returns `false`.

**The clipboard is honest about what it knows.** `writeToClipboard` reports `true` only when the
platform module accepted the string, and reports `false` when the module is absent or throws; the
limit — the platform cannot confirm the operating system kept the copy, and reading it back would
provoke an iOS paste prompt — is documented (`NATIVE-IMPOSSIBLE-REPORT.md` I2-6, D-5(c)).

**The announcement level is decided once.** Core's `ANNOUNCEMENT_ROLE` maps a level to the role the
web writes, and web's copy, toast, loading and data-table surfaces read it instead of a literal; the
platform maps the same level to a live region and a role. `CORE-MIGRATION-REPORT.md` §5 row 7 is
closed.
