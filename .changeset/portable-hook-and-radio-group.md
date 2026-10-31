---
"asheeui": patch
---

`useAsheeConfig` is on the portable surface, and `RadioGroup` is generated as the component it is.

Both were declared wrongly in `PORTABLE_API`: `useAsheeConfig` was filtered out as if it were a
configuration type even though both renderers have published the hook since B09, and `RadioGroup` was
declared a `type`, so the generated umbrella exported it with `export type` and a shared file could not
render it. The showcase — the workspace's web consumer, now importing through `asheeui` — found both:
it calls the hook and renders the group.

No other name changes. The portable surface is 182 names.
