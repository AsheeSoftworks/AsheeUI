---
"@asheeui/core": minor
"@asheeui/native": minor
"@asheeui/web": patch
---

Native gains the `Split` layout primitive, and the module it reads is stated once in
`@asheeui/core`.

- `@asheeui/native` renders two panes that stack while the window is narrow and sit side by
  side once it is wide enough. The web states the breakpoint as a variant prefix because a
  browser has media queries; the platform has none to imitate, so the component asks
  `useBreakpoint` what the window has reached and decides the direction, the division of the
  width and the edge the separator sits on from the answer. Both panes stay in the tree at
  every width, which is the same promise the web keeps by leaving them in the document.
- `@asheeui/core` gains the split contract (`components.split`) and one module holding every
  class string both renderers read: the stacking, the alignment, the division of the width,
  the separator and the sticky treatment, per platform. `stickyEnd` is a shared option the
  platform has nothing to say about, because it has no scroll-linked positioning; it is stated
  as an empty class rather than dropped, so a screen configures one shell for both platforms.
- `@asheeui/web` points its split at those shared modules. The rendered markup and the public
  props are unchanged.
- The parity queue drops from 15 to 14: 44 of the 58 components the matrix promises for native
  are implemented, and the remaining fourteen are the shell, page-furniture and data families.
