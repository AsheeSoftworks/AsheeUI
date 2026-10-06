---
"@asheeui/core": minor
"@asheeui/native": minor
"@asheeui/web": patch
---

Native gains the `PricingCard` pattern, and the options it takes are stated once in
`@asheeui/core`.

- `@asheeui/native` renders a plan in the framework's own `Card` and the framework's own
  `Text`, and places several plans with `Stack` exactly as the web places several with
  `Grid`. The plan's name heads the card as the platform's header role, so a reader can move
  from plan to plan.
- Three things the web draws are stated the platform's way. Included and excluded features
  carry characters rather than drawings, because this package ships no icon set (the
  framework's tick and the dismissal glyph the rest of the native components already draw).
  The recommended plan is marked with the card's own `color`, which is the accent every
  other native surface states, rather than with a ring the platform's card does not paint.
  An elevated plan keeps the raised surface's own colour, because the platform's card paints
  no shadow: the web's `elevated` surface is the framework's filled surface with a shadow,
  and a bordered surface would be the wrong treatment rather than a plain one.
- The exclusion is stated in words as well as in style on both platforms, and the shared
  module for text that is read rather than seen is now stated once in `@asheeui/core`
  (`VISUALLY_HIDDEN_CLASS` and its native counterpart), rather than beside each component
  that needs it.
- `@asheeui/core` gains the pricing-card contract (`components.pricingcard`, including the
  `PricingFeatureItem` line the props carry) and one module holding every class string both
  renderers read.
- `@asheeui/web` points its pricing card at those shared modules and its own styles file is
  removed. The rendered markup and the public props are unchanged.
- The parity queue drops from 11 to 10: 48 of the 58 components the matrix promises for
  native are implemented.
