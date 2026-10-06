---
"@asheeui/core": minor
"@asheeui/native": minor
"@asheeui/web": patch
---

Native gains the clipboard pair — `Clipboard` and `CopyButton` — and the contract the two
read is stated once in `@asheeui/core`.

- `@asheeui/native` keeps the pair's shape: `Clipboard` is a render function with a state
  (whether the text is on the clipboard, whether the last attempt failed, how to copy, how
  to clear) and `CopyButton` is the framework's control built on it, so a consumer with an
  icon in a row or a menu item uses the primitive and gets the same behaviour the button
  has. The copied state is a timer on both platforms, cleared on unmount, and nothing is
  written during a render.
- What performs the write is what differs. The browser has a clipboard API with a
  selection fallback; the platform has its own module, which the package reads through a
  binding of its own (`writeToClipboard`) rather than reaching for a third-party clipboard
  package every consumer's bundle would pay for. A refused write rejects with the platform's
  own cause, which is what a consumer's `onError` receives.
- The control's affordances are characters where the web's are drawings: the package ships
  no icon set, so the copy glyph and the framework's tick stand in for `CopyIcon` and
  `CheckIcon`, and a consumer who wants a drawing passes `copyIcon` or `copiedIcon`. The
  button's accessible name is its label rather than its label with a glyph in front of it,
  because a reader asked to press "Copy" should hear "Copy".
- The result is announced the same way on both platforms: a status region beside the
  control repeats what the label now says, because a label change is not announced on
  either. The web hides that region with `sr-only`; the platform has no such utility, so the
  region is a pixel-sized transparent view — out of the way, still in the accessibility tree.
- `@asheeui/core` gains the clipboard contract (`components.clipboard`) and the one module
  both renderers read for the status region each announces through, along with the
  characters the native control draws.
- `@asheeui/web` points its pair at those shared modules and its own styles file is removed.
  The rendered markup and the public props are unchanged.
- The parity queue drops from 13 to 12: 46 of the 58 components the matrix promises for
  native are implemented.
