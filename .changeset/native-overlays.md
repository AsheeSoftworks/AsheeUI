---
"@asheeui/core": minor
"@asheeui/native": minor
"@asheeui/web": patch
---

Native gains the overlays — `Modal`, `Drawer` and `Tooltip` — and the class dictionaries those
three share are stated once in `@asheeui/core`.

- `@asheeui/native` presents each overlay the way the platform does rather than the way the
  browser does. A modal is the platform's own modal presentation, which takes the screen, keeps
  the reader inside it and hands the framework the platform's way out; the surface takes its own
  presses, so pressing what a dialog holds never dismisses it. A drawer is the sheet the platform
  uses for this — a panel at the side of a phone has nowhere to be, so a side placement resolves
  to the sheet while a top or bottom placement keeps its edge. A tooltip is shown on a long press,
  with the same `delay` the web counts as the length of that press, placed against the platform's
  own measurement of its trigger, and stated as the trigger's accessibility hint as well, so a
  reader using assistive technology is told it without finding the gesture.
- `@asheeui/core` gains the three modules those components share with the web, including two maps
  that say what the platform does with a placement it has no room for, and the modal's own width
  scale, which is not the framework's three densities.
- `@asheeui/web` points its modal, drawer and tooltip at those shared maps. The rendered markup
  and the public props are unchanged.
- The parity queue drops from 25 to 22: 36 of the 58 components the matrix promises for native
  are implemented, and the remaining twenty-two are the marketing, content and shell families.
