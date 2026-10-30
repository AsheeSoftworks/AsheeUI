---
"asheeui": minor
---

`asheeui/styles`, `asheeui/styles.css` and `asheeui/section-kit` resolve, and the renderers are
optional peers.

- **The stylesheet comes from the umbrella.** `@import "asheeui/styles"` is now the documented web
  import; it is one line, `@import "@asheeui/web/styles";`, so an app no longer names the renderer in
  its CSS.
- **The section kit is portable.** `asheeui/section-kit` routes to both renderers and exports
  `SectionHeading` and `ActionGroup`. `SkipLink` stays on `@asheeui/web/section-kit` because a device
  has no tab order to skip.
- **The renderers are optional peers.** `@asheeui/web` and `@asheeui/native` moved from
  `dependencies` to `peerDependencies` with `peerDependenciesMeta.optional`, so `npm i asheeui`
  installs `@asheeui/core` and no renderer. An application installs the one it builds for.
- **Tailwind spans both majors.** The peer range is `>=3.4.0` (web uses 4, native uses NativeWind on
  3), and `sideEffects: ["*.css"]` keeps the stylesheet from being tree-shaken away.
- `files` ships the new entries, and `publishConfig.exports` mirrors the source map.

The umbrella guard's sixth assertion — the promised subpaths resolve and are shipped — is blocking
again now that it passes.
