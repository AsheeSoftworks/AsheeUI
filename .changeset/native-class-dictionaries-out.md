---
"@asheeui/core": major
"@asheeui/native": minor
---

The platform's class dictionaries move out of `@asheeui/core` and into `@asheeui/native`.

**397 `NATIVE_*` constants, 53 modules.** Every string NativeWind compiles for the device was
declared in core beside the web renderer's own strings, in 54 files. Core is the shared contract,
and a class string states a decision about pixels the two platforms do not share — so the platform's
dictionaries now live in `packages/native/src/styles/`, one module per component, and are published
by `@asheeui/native`. **No name and no value changed**: every constant is the one core published,
character for character, and the imports that read them were rewritten in the same commit. A file
in core that held only the platform's strings leaves the entry with them; a file that also held the
web's keeps its web half, and says so in its header.

**The move is by the `NATIVE_` prefix, never by content.** `CHIP_PRESSABLE_CLASS` contains `active:`
— a valid web variant and a native marker — and is web's. `NATIVE_BUTTON_BASE_CLASS` is a perfectly
portable string, and stays the platform's because its layout differs from the web's `inline-flex`.
The prefix is the only reliable signal, which is why `CORE-MIGRATION-REPORT.md` §10 warns about the
content heuristic.

**The tests moved with the dictionaries.** Twenty-seven `*-styles.test.ts` files in core asserted
both renderers' maps side by side — often in the same test, so the two could not drift. They now live
in `@asheeui/native`, beside the code, because native is the only package that can still read both
halves (`C2` moves the web's half to `@asheeui/web` and these assertions follow it). One test stayed
in core: the one that reads `image-config.ts`'s prose, because that file did not move.

**What a consumer does about it:** anyone importing `NATIVE_BUTTON_SIZE_CLASS` or
`NATIVE_ROW_LIST_CLASS` from `@asheeui/core` now imports it from `@asheeui/native`. That is the
point of the shrink; `B24`'s migration guide lists every moved family with its new home.

`@asheeui/core` loses 397 exports and keeps the tokens, the rules, the configuration vocabulary and
the types — the contract both renderers compile against.
