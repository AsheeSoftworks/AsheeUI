---
"@asheeui/web": minor
"@asheeui/core": minor
---

A component that has to *choose* an arrangement can now ask how wide it is, on either renderer,
under one name: `useBreakpoint()` is exported by `@asheeui/web` with the same shape the platform's
hook already had — `width`, `breakpoint` (the largest name reached, or `base`) and `isAtLeast` —
and `useReduceMotion()` joins it as the web's name for the reader's motion preference.

- `@asheeui/core` gains `resolveBreakpoint` (the rule that turns a width into a breakpoint name)
  and `BreakpointState` (the shape both hooks return), so neither renderer owns the boundaries and
  a component that measures its own container can reuse the rule.
- The web hook measures `window.innerWidth` after mount and follows `resize`. Measuring after mount
  is deliberate: server-rendered markup is the narrow arrangement, so hydration never mismatches
  and a wide layout does not flash before the reader's width is known.
- `@asheeui/native`'s `resolveBreakpoint` is now the core's — same signature, one implementation —
  and its `NativeBreakpoint`/`NativeBreakpointState` names remain as aliases of the shared types.
- `useReduceMotion` is exported from `@asheeui/web`, so a shared component imports one name for the
  motion preference; `usePrefersReducedMotion` stays as the web's own spelling.

The umbrella needed no change: both branches export the hooks the renderer exports, so
`import { useBreakpoint } from "asheeui"` resolves to the platform's hook in a native bundle and to
the measuring one in a browser bundle.
