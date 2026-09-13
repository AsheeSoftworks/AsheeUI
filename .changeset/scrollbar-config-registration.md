---
"asheeui": patch
---

Fix: the structural scrollbar configuration is now registered with the component registry.

The scrollbar configuration module was not imported anywhere, so its defaults were never registered and
`config.components.scrollbar` could not be resolved. The package entry point now imports it for its registration
side effect, matching how every other component config module registers. The module is still not exported, so it
remains outside the public component inventory.

Tooling: the dangling `build:registry` script was removed from `packages/ui/package.json`; it pointed at
`src/scripts/build-registry.ts`, which no longer exists.

Packaging: `sideEffects` now also lists the component config modules (`**/*-config*`). The previous value (`*.css`)
told bundlers that every JavaScript module was free of side effects, so registration imports that exist only for
their side effect were silently dropped from bundles. This was observed in the published build, where the scrollbar
registration was removed until the field was corrected.
