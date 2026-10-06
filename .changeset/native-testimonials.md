---
"@asheeui/core": minor
"@asheeui/native": minor
"@asheeui/web": patch
---

Native gains the `Testimonials` band, and the band's options are stated once in
`@asheeui/core`.

- `@asheeui/native` renders a heading and a responsive grid of attributed quotes, each in
  the framework's own `Card` and each credited through the framework's own `Avatar`, so the
  band inherits the framework's surfaces and the avatar's substitution API and initials
  fallback without the consumer doing anything. It composes the platform's `Section`,
  `Container` and `Grid`, so a band written for a browser is a band on a device.
- What differs is where the attribution's meaning lives. The web renders each quote as a
  `figure` with its `figcaption` inside a list, so a browser announces a set of attributed
  quotations. The platform has no list and no figure, so the band keeps the words and the
  attribution in one surface and in that order — the words first, then who said them — which
  is the same promise stated the way the platform can keep it.
- `@asheeui/core` gains the testimonials contract (`components.testimonials` and the
  `TestimonialItem` a quote is described by) and one module holding every class string both
  renderers read. The band options themselves come from the shared `section-block` vocabulary
  every band reads, so a testimonials band and a feature grid answer the same questions the
  same way.
- `@asheeui/web` points its testimonials at those shared modules and its own styles file is
  removed. The rendered markup and the public props are unchanged.
- The parity queue drops from 10 to 9: 49 of the 58 components the matrix promises for
  native are implemented.
