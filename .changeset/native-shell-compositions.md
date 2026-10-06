---
"@asheeui/core": minor
"@asheeui/native": minor
"@asheeui/web": patch
---

Native gains the screen shell — `Navbar` (with its `TabBar`), `Sidebar`, `SidebarLayout`,
`DocsLayout` and `AuthLayout` — and the five contracts those components state are defined once
in `@asheeui/core`.

- `@asheeui/native` builds them the way a screen is built rather than the way a document is, and
  each one records what the platform decided instead of imitating the web. A bar scrolls its row
  of destinations rather than opening the web's disclosure, because a browser's bar is a single
  line it cannot scroll sideways and a platform's is not, so `mobileOpen`, `onMobileOpenChange`
  and `mobileLabel` resolve through the shared contract and change nothing; the current
  destination is stated as the control's selected state where the web states `aria-current`. The
  module also publishes `TabBar`, the platform's own second half of a navigation. A sidebar
  collapses to a rail, its rows render through the framework's own `Link` so a consumer keeps its
  routing, and a collapsed row explains itself through the framework's native `Tooltip`, which the
  platform shows on a long press. `SidebarLayout` and `DocsLayout` are stacked screens: the shell
  asks `useBreakpoint` once and states the direction it means, places the column outside the
  consumer's scrolling region rather than pinning it, and a documentation page's three regions
  become three stacked sections, each headed with the name the web gives its landmark. `AuthLayout`
  is what fills the height the platform gives the screen, with the media column decided once by
  `useBreakpoint`. All five register their defaults with the native registry, so
  `components.sidebar` and its four siblings resolve through the same cascade as everything else.
- `@asheeui/core` gains the five contracts — `components.sidebar`, `components.sidebarlayout`,
  `components.navbar`, `components.docslayout` and `components.authlayout`, including the shared
  description of an item, a destination and a region — and one module per component holding every
  class string both renderers compile, per platform, side by side.
- `@asheeui/web` points the same five components at those shared modules. The rendered markup and
  the public props are unchanged.
- The parity queue drops from 5 to 0: all 58 components the matrix promises for native are
  implemented, so `scripts/native-parity.json` holds no queued module. What the increment leaves
  is a published package waiting on a consumer's own screen rather than another component.
