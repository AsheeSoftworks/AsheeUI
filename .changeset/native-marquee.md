---
"@asheeui/core": minor
"@asheeui/native": minor
"@asheeui/web": patch
---

Native gains `Marquee`, and the options it moves by are stated once in `@asheeui/core`.

- `@asheeui/native` moves the content the way the platform can. The web states a keyframe
  animation over a track it has already sized in its stylesheet and translates it by half;
  the platform has neither, so it measures the content once the platform has laid it out,
  keeps an animated value of its own, and translates by the measured length of one set plus
  the gap — the exact distance at which the second copy has taken the first copy's place, so
  the loop has no seam. Until the content has been measured nothing moves, rather than
  jumping to a position nobody chose.
- The copy is in the tree twice and kept out of the accessibility tree rather than off the
  screen, so a reader hears the items once while the loop still has something to move into
  place — the same promise the web keeps with `aria-hidden`.
- The movement yields to the platform's own motion setting, through a new
  `useReduceMotion` hook, exactly as the web's yields to the reader's preference: a reader
  can turn the setting on while a screen is open, so the loop follows it and the content is
  read standing still. The new shared `isAnimated` option states the same thing
  deliberately, for a screen that must not move at all, and the web honours it as well.
- Two of the contract's options are the web's to keep. `pauseOnHover` is a pointer's
  gesture and a touch screen has no pointer resting on anything; `fadeEdges` is a gradient,
  which the platform paints only through a drawing library this package does not depend on,
  and a band of the background colour would be a hard edge pretending to be a fade. Both
  still resolve through the shared contract and are documented as empty classes, so one
  configuration describes both platforms and neither option is silently stripped.
- The shared gap is a CSS length, because it is one value for both platforms. The platform
  reads it as its own measure (`resolveLength`): the framework's `rem` is sixteen
  density-independent pixels, a `px` is one, and a unit a view cannot state falls back to
  the framework's own gap rather than to a number nobody chose.
- `@asheeui/core` gains the marquee contract (`components.marquee`) and one module holding
  every class string both renderers read: the frame, the track, the sets, the items, the
  fade gradients and the two native substitutions.
- `@asheeui/web` points its marquee at those shared modules and its own styles file is
  removed. The rendered markup and the public props are unchanged.
- The parity queue drops from 12 to 11: 47 of the 58 components the matrix promises for
  native are implemented.
