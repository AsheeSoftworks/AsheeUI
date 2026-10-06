---
"@asheeui/core": minor
"@asheeui/native": minor
"@asheeui/web": patch
---

Native gains the content blocks — `Avatar`, `Chip` and `Image` — and the three contracts
those blocks read are stated once in `@asheeui/core`.

- `@asheeui/native` renders an avatar as a surface holding the consumer's picture, falling
  back to the entity's initials from `getInitials` in `@asheeui/core`, and announces one
  name through one image role rather than the initials and the picture separately. A chip
  keeps the web's anatomy — avatar, leading icon, status dot, trailing icon and remove
  control — and makes the remove control its own control with its own name, drawing its
  affordances from characters because this package ships no icon set; a consumer with a
  drawing passes `closeIcon` and the character stands in when they do not. An image is a
  frame that states the shape the platform cannot infer before a remote source arrives,
  claims its space with the framework's own `Skeleton`, and states the alternatives it
  cannot honour: a picture is fetched when its view mounts, so the web's `loading` option
  has no counterpart here and is not offered.
- `@asheeui/core` gains the avatar, chip and image contracts (`components.avatar`,
  `components.chip`, `components.image`) and one module per component holding the class
  strings both renderers read, so a token or a picture is dressed from one place. The
  avatar's initials rule moves to the core as `getInitials`, because presenting an entity
  the same way is a promise the platform does not change.
- `@asheeui/web` points its avatar, chip and image at those shared modules. The rendered
  markup and the public props are unchanged.
- The parity queue drops from 18 to 15: 43 of the 58 components the matrix promises for
  native are implemented, and the remaining fifteen are the shells, the navigation
  furniture and the data family.
