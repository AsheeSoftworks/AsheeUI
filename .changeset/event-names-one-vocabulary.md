---
"@asheeui/core": minor
"@asheeui/native": minor
"@asheeui/web": minor
---

One act has one spelling: `onClick` and `onPress` both work on both renderers, and the field family
accepts `onChange`, `onChangeText` and `onValueChange`.

**The rule lives in core.** `resolvePress` runs `onClick` first and then `onPress`, so a component
that passes both fires both in the order the web button already documented. `resolveChange` runs
`onChange`, `onChangeText` and `onValueChange` in that order and hands `onChange` a `{ target: { value } }`
shim. The shim is deliberately narrow: `preventDefault` and `stopPropagation` do nothing on a device,
because there is no default action or propagation to stop. A consumer that relies on either is on the
web, and the module says so.

**The native renderer routes its presses through the resolver.** `Button`, `Card`, `Chip`, `Link`,
`Switch` and `Radio` read the platform `Pressable`'s `onClick` (which React Native already declares)
and pass both names to `resolvePress`. A card or a chip with only `onClick` becomes pressable, which is
what the web card and chip already do with the same prop. The password and picker families keep their
own press semantics; `onPress` is not removed from any prop.

**The field family reports one change through three names.** `Input`, `Textarea`, `SearchInput`,
`Dropmenu`, `Autocomplete` and `PinInput` resolve `onChange`/`onChangeText`/`onValueChange` through
`resolveChange`; `MultiSelect`'s value is a list rather than a string, so it keeps `onChange` alone.
`Autocomplete` keeps the picked option on its `onValueChange` by wrapping it before the resolver sees
it, so the metadata is not lost to the value-only signature.

**The web renderer gained the platform's names where the platform had them.** `Card`, `Chip` and
`Link` accept `onPress`; `Switch` and `Radio` accept `onClick`; `Input`, `Textarea`, `SearchInput`,
`Dropmenu`, `Autocomplete` and `PinInput` accept the two change names they lacked, in the same order
the resolver states. The plan named core and native in this changeset; web is included because the
pairing table made the web half a real change rather than a tolerance.

**A pairing table in core reads both packages as text.** It resolves each paired component's props
type through the bases it extends and asserts the two renderers accept the same handler names for the
act they share. It lives in core because neither renderer may import the other, and it is the test
that stops the two spellings drifting apart again.
