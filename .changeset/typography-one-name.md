---
"@asheeui/native": minor
"@asheeui/web": minor
"asheeui": patch
---

`Typography` is the name for semantic text on both renderers, and `Text` is the same component
under the other name.

The two renderers had one component and two names — `Typography` on the web, `Text` on the platform
— and the umbrella carried the difference so a shared component could write one of them. That alias
was doing the renderers' job: the spellings are the renderers' own, so the pair belongs in them.
Both packages now export both names, with `Typography` canonical and `Text` the same reference, and
the umbrella is back to `export *` on both branches:

- **`@asheeui/native`** exports `Typography` as the component and keeps `Text` as a
  `deprecatedAlias` of it — the platform's own word for a line of text stays exported, and a screen
  written against it keeps rendering the same component. The module announces the move once per
  process, in development only, and `Text === Typography` is asserted.
- **`@asheeui/web`** gains `Text` as an alias of `Typography`. It is not deprecated on this
  renderer, because the web never published a `Text` to move away from; it exists so the pair is
  the same on both platforms, and its identity is asserted too.
- **`asheeui`** drops `export { Typography as Text }`. With the web renderer publishing `Text`
  itself, that line became a duplicate export, so a shared component reaches both names through the
  same `export *` and the umbrella holds no text alias of its own. The `TextProps` type is still
  stated by the umbrella, because the web's props type is `TypographyProps`.

Native's own components now render `Typography` (41 files): the framework's own code speaks the
canonical name, which is what makes the alias a courtesy to consumers rather than a load-bearing
part of the package. `@asheeui/puck`'s native paragraph block was migrated for the same reason.

Props are untouched — Typography's prop parity is a later step, and this release changes what the
component is called, not what it accepts.
