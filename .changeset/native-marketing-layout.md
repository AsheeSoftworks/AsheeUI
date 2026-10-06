---
"@asheeui/core": minor
"@asheeui/native": minor
"@asheeui/web": patch
---

Native gains the `MarketingLayout` composition, and the options it takes are stated once in
`@asheeui/core`.

- `@asheeui/native` holds the page's navigation, its main region of sections and its footer
  in one scrolling region, in the order the web shows them, with the sections inside the
  named main region. Every region is taken as a node, so a consumer passes the framework's
  own navigation, hero, feature grid, call to action and footer, and nothing about their
  content is decided by the composition.
- What the platform states differently is what it has to scroll. The web is a document that
  grows with what it holds, so its shell is a full-height column and the document scrolls; a
  native screen is given its height by the platform, so the composition is the scrolling
  region itself.
- Two options the platform keeps in its own vocabulary. The web's skip link is a keyboard
  reader's way past the navigation, and a platform screen has no focus order to skip through,
  so `skipLink` and `skipLinkLabel` resolve through the shared contract and render nothing.
  The web names its main region with an `id` so a link can point at it; the platform names a
  view with `nativeID`, which is the identifier its own reader can be pointed at, so `mainId`
  becomes that.
- `@asheeui/core` gains the marketing-layout contract (`components.marketinglayout`) and one
  module holding every class string both renderers read: the shell, the background each
  renderer paints, the scrolling content and the main region.
- `@asheeui/web` points its composition at those shared modules and its own styles file is
  removed. The rendered markup and the public props are unchanged.
- The parity queue drops from 6 to 5: 53 of the 58 components the matrix promises for native
  are implemented, and the remaining five are the navigation furniture and the three layout
  shells that compose it.
