---
"@asheeui/core": minor
"@asheeui/web": minor
"@asheeui/native": minor
---

Seven configuration sections move into `@asheeui/core`, and the two component registries become one.

**`Card`, `Typography` and the five layout primitives now state their configuration once.** Card (with
its image options), Typography (with the per-role retuning table), Container, Centered, Grid, Section
and Stack each get a module under `packages/core/src/components/`, with the interface, the unions it
accepts and a `declare module` augmentation — so `components.card` is a typed section on both
platforms instead of a web type the platform happens to accept. Web's seven config modules keep their
defaults and hard fallbacks and re-export the shared types; native's keeps its narrower documented
interfaces and its own values.

**No class string came back with them.** These are the first core modules since C1–C3 that a renderer
draws from, and `pnpm check:core-charter` confirms they hold types, unions and the registry
augmentation only.

**One registry, not two.** `getNativeComponentDefaults()` now reads the same map
`registerComponentDefaults` writes, and `NativeComponentConfigRegistry` is a documented subset of
`ComponentTypeConfigRegistry` (`NativeCardConfig` is `CardConfig` without the two options a device
leaves alone). A `components.button` a consumer writes is therefore answered by one default table, not
two. No value moved: a native button is still density `lg`, a native section still spaces by `md` — the
batch is a move of *shapes*, and the tests assert the values byte for byte.

**The Card's treatment vocabulary is now one union of seven** — the framework's five plus the web
card's `elevated` and `flat` — and `resolveCardVariant` lands any of them on a treatment each renderer
draws. The web card keeps its four surface names internally, keyed by its own `CardSurface` type.

**The Grid's counts are the shared ones.** A native grid accepted any `number`; it now accepts
`GridColumns`, the vocabulary `resolveGridColumns` can actually inherit, which is the same type the web
grid states.

**The fallbacks stay per renderer, on purpose.** Four of the five differ in value (a web section spaces
by `lg`, a device by `md`; the web's Centered and Section state container options a device has no
container for), and the registry work is about the *shape*. Moving either value into core would change
what the other renderer paints, which is the one thing this batch is not allowed to do.
