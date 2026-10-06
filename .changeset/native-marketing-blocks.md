---
"@asheeui/core": minor
"@asheeui/native": minor
"@asheeui/web": patch
---

Native gains the marketing and content blocks — `Hero`, `FeatureGrid`, `CTA` and `Footer` —
and the band vocabulary those four share is stated once in `@asheeui/core`.

- `@asheeui/native` renders each band with the platform's own layout kit. A hero measures the
  window and puts its media beside the text or under it, and moves the media through the tree
  rather than through an order class, which is the only way to state a side when there is no
  stylesheet. A feature grid reads the window for its column count and renders every feature
  through the framework's own `Card`, so a feature with a destination is a pressable card that
  follows it through the platform's URL handler and one without stays a surface. A call to action
  states the panel density the web states at its smallest step, because one window cannot pad
  itself for a desktop. A footer keeps its brand column above its groups and lets the groups wrap,
  and names each group's title as a heading a reader can move between.
- `@asheeui/core` gains the four band contracts (`components.hero`, `components.featuregrid`,
  `components.cta`, `components.footer`), the shared grid vocabulary, and the band vocabulary the
  web and native renderers read side by side: the container widths, the background treatments, the
  heading step each size resolves to, and the class dictionaries for the heading block and the
  action row on both platforms. The four bands all extend the same option set, so a hero
  configured for a browser is configured for a device.
- `@asheeui/web` points its hero, feature grid, call to action and footer at those shared modules,
  and its section kit at the shared heading and action dictionaries. The rendered markup and the
  public props are unchanged.
- The native layout kit now reads the shared container and background vocabulary, so a `Section`
  written with `background="muted"` and a band written with the same option are talking about one
  idea. `none` paints the theme's own background, because a native screen has no page behind it to
  show through.
- The native `Grid` now carries the column counts it is given for `md` and `lg`. The cascade
  resolves exactly the keys a fallback declares, so a key left out of the grid's fallback never
  reached it: a grid that stated a count per breakpoint fell back to its smallest count on every
  window, and now states the count the window actually reached.
- The parity queue drops from 22 to 18: 40 of the 58 components the matrix promises for native are
  implemented, and the remaining eighteen are the shell, content and navigation families.
- `@asheeui/web` states the tooltip's `className` fallback as well. The overlay increment added that
  option to the shared tooltip contract and left it out of the web fallback, so the package no
  longer type-checked; the value is the option's documented default and the component reads the
  configured value directly, so no rendered tooltip changes.
