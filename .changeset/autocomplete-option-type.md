---
"asheeui": patch
---

Give the autocomplete a public option type.

`Autocomplete`'s `options` and `onValueChange` props named `MenuOption`, which is
internal by design and therefore not importable by a consumer. The handler a
consumer passes could not be typed without reaching into the package. The public
shape is now `AutocompleteOption`, exported from the package root and structurally
identical to the internal type, so nothing changes at runtime and an existing
handler keeps working.
