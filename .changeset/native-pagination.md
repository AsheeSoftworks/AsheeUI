---
"@asheeui/core": minor
"@asheeui/native": minor
"@asheeui/web": patch
---

Native gains the `Pagination` collection footer, and the options it reads are stated once in
`@asheeui/core`.

- `@asheeui/native` states where a reader is in a paged collection and loads more of it,
  because that is how a platform list moves through a collection: the web draws a numbered
  trail — the first and last page, the reader's neighbours, a gap between them and a control
  for each, as a link when addresses are supplied and a button otherwise — and a phone has
  no room for a trail and no address to name. The footer states its position, which is a
  live region so a reader hears where they are as pages load, offers one control that loads
  the next page, and offers nothing once the collection is exhausted; a collection with no
  pages renders no footer at all, because an empty state belongs to the list.
- The footer never reports a page the collection cannot act on: it clamps the current page
  to the collection, and a press during a load is ignored because the control is disabled.
- Two options the web's trail needs are stated rather than hidden. `siblingCount` and
  `showEdges` describe how many neighbours to draw and whether the collection's ends are
  offered; the platform's footer draws no range, so they resolve through the shared contract
  — one configuration describes both platforms — and change nothing here. The tests state
  that, so it stays true.
- `@asheeui/core` gains the pagination contract (`components.pagination`) and one module
  holding every class string both renderers read, including the control and disabled
  treatments the web renderer used to state inline.
- `@asheeui/web` points its pagination at those shared modules and its own styles file is
  removed. The rendered markup and the public props are unchanged.
- The parity queue drops from 9 to 8: 50 of the 58 components the matrix promises for native
  are implemented.
