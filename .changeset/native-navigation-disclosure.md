---
"@asheeui/core": minor
"@asheeui/native": minor
"@asheeui/web": patch
---

Native gains the navigation and disclosure family, and the class dictionaries those four
share are stated once in `@asheeui/core`.

- `@asheeui/native` implements `Link`, `Tabs`, `Accordion` and `Carousel` with the
  platform's own behaviour rather than with an imitation of the browser's. A link underlines
  itself while it is pressed and follows its destination through the platform's URL handler
  unless the consumer handles the press or names the component that renders it. A tab bar
  scrolls with the platform's scroll view, and is a row of tabs rather than one tablist,
  because a container that is an accessibility element hides the controls inside it. An
  accordion opens with the platform's own layout animation and does not draw a closed panel
  at all, which is what takes it out of the accessibility tree — the platform's answer to the
  web's `inert`. A carousel pages with the platform's scroll view, which is why `loop` wraps
  only its autoplay: a scroll view that teleported its content would be lying about where the
  reader is.
- `@asheeui/core` gains the four modules those components share with the web: the
  configuration both platforms agree on and the class strings each renderer compiles, native
  and web side by side. Two of them state what a component that has no treatment for the
  platform's filled default does instead, which is resolve it to the treatment the component
  documents.
- `@asheeui/web` points its link, tabs, accordion and carousel at those shared maps. The
  rendered markup and the public props are unchanged.
- `scripts/native-parity.json` drops from 29 to 25: 33 of the 58 components the matrix
  promises for native are now implemented.
