---
"asheeui": patch
---

Apply the structural scrollbar configuration.

The scrollbar shape and behaviour set under `components.scrollbar` had no effect:
the stylesheet reads `--ashee-scrollbar-*`, and nothing emitted those variables.
They are now written into the theme style element alongside the theme colours, so
`width`, `radius`, `trackRadius`, `thumbBorder` and `gutter` apply as documented.
`trackRadius` still falls back to `radius` when it is not set.
