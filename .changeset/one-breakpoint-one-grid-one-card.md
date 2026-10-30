---
"@asheeui/core": minor
"@asheeui/web": minor
"@asheeui/native": minor
---

The breakpoint, the grid's column count and the card's surface are one rule each, in core, under one
name on both renderers.

**`BreakpointName` and `BreakpointState` are the names both renderers publish.** They were already
in core; the renderers exported their own spellings (`WebBreakpoint`, `NativeBreakpoint`, and the
`…State` pair) over the same types, which is a name that changes between platforms for no reason. Both
packages now export the shared names and `resolveBreakpoint` with them, and the prefixed spellings stay
as deprecated aliases announced once per process.

**`resolveGridColumns` is core's.** It lived in the platform's layout configuration, so a browser that
measured its own container had no way to ask the same question. A count stated at a smaller breakpoint
still inherits to the larger ones; that rule is now written once, and both packages export it. The
platform's `Grid` calls it as before — it is the renderer that needs a number, since the web's `Grid`
states its counts as classes and lets a media query do the work.

**`resolveCardVariant` is core's too, and the rule is the neutral one.** The two renderers had two
tables: the platform's mapped the shared treatments (plus the web's two surface names) onto the
treatments a card can draw, and the web's mapped the same names onto its own four surfaces. The first
of those is the rule — it speaks the shared vocabulary — so it moved to core unchanged, and the
platform's `resolveNativeCardVariant` is now **the same reference**, deprecated and announced. The web
renderer adapts to the rule instead of owning it: `card-surface.ts` (not re-exported, because it is the
component's own step between the rule and its class map) projects the resolved treatment onto
`elevated` / `bordered` / `flat` / `ghost`, and takes the card's own surface names as themselves so
`flat` stays `flat`.

Moving *the web's* table into core, as the plan's step reads, would have handed the platform's card
`elevated` and `flat` — names its five-surface class map has no entry for — so the card would have
rendered an unstyled block. That is the same failure the rule exists to prevent, one renderer over.

One behaviour change follows from the move, and it is the intended one: `@asheeui/web`'s
`resolveCardVariant` now returns the **shared treatment** (`solid`, `faded`, …) rather than a web
surface. The web card renders exactly what it rendered before, through `cardSurfaceFor`; a consumer
that called the resolver to obtain a surface should read the card's class map for the surface it
draws.
