---
"asheeui": minor
---

Change the built-in default radius and variant.

Components now default to a boxy corner radius (`xs`) and a faded fill, matching the framework's confirmed visual
language. The previous built-in defaults were `md` and `solid`.

Consumers who prefer the previous look set `defaultRadius: "md"` and `defaultVariant: "solid"` in their
configuration, or set them per component under `components`.
