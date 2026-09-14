---
"asheeui": minor
---

Add the typography system: semantic roles, token maps and a `Typography` component.

`Typography` renders the semantic element a role implies and applies that role's complete, static class string.
Eleven roles are provided (`display`, `heading-xl`, `heading-lg`, `heading-md`, `heading-sm`, `body-lg`, `body-md`,
`body-sm`, `label`, `caption`, `overline`), together with size, weight, leading, tracking, tone and alignment tokens.

- Colour is applied through `tone`, which resolves framework colour tokens, so standard text needs no Tailwind colour
  utilities.
- Any part of a role's treatment can be overridden per instance (`size`, `weight`, `leading`, `tracking`), and
  `components.typography.roles` retunes a role application-wide without changing its meaning.
- The ARIA `role` attribute is not forwarded, because `role` is the typography role.
- `as` selects the element without changing the treatment.

Additive and pre-1.0: no existing component, default, or dependency is affected. The public component inventory grows
from 26 to 27.
