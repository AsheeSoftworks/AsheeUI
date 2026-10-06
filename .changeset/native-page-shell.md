---
"@asheeui/core": minor
"@asheeui/native": minor
"@asheeui/web": patch
---

Native gains the application-screen shell — `Page`, `PageHeader`, `PageContent` and
`PageFooter` — and the options those four share are stated once in `@asheeui/core`.

- `@asheeui/native` renders the shell the way a screen is built rather than the way a document
  is. The shell is a full-height column that grows into the height the platform gives it; the
  header announces itself as the platform's header landmark, and the parts are contained by
  default, so a screen gets the framework's width and gutter without extra markup. The one
  option the platform cannot honour in place is `sticky`: a native screen has no scroll-linked
  positioning, so a bar that must stay in view belongs outside the scrolling region — the
  platform's own way of pinning a bar — and the resolved value is kept so one configuration
  still describes both platforms. The header also paints the theme's background solidly where
  the web bar is translucent and blurs what scrolls behind it, because there is no backdrop to
  filter.
- `@asheeui/core` gains the page contract (`components.page`) and one module holding every
  class string both renderers read: the shell, the two bars, the content area, the separators
  and the inner rows, per platform. The web's header row states no direction, because a block
  element lays its children out along the row already; the platform's states the direction it
  means rather than relying on a default.
- `@asheeui/web` points its four page parts at those shared modules. The rendered markup and
  the public props are unchanged.
- The parity queue drops from 14 to 13: 45 of the 58 components the matrix promises for native
  are implemented, and the remaining thirteen are the shells, the navigation furniture and the
  data family.
