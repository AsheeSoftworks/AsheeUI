---
"@asheeui/native": minor
"asheeui": minor
---

A correctly configured application renders styled again, and the setup it needs is one line
shorter than it was.

**The defect: `dist` emitted the wrong JSX runtime.** The published artifact was compiled with
TypeScript's default emit, `react/jsx-runtime`. NativeWind does not read `className` at runtime
— its Babel transform rewrites JSX — and a compiled module contains neither JSX nor
`React.createElement`, so a consumer's Babel had nothing to rewrite: the `className` stayed a
plain prop on a `View`, and React Native ignored it. Every framework component rendered with
no style at all. The copy was right, the structure was right, and there was no padding, no card
surface, no border, no type scale, the status bar over the first heading — and nothing thrown
or warned to say so. 68 of the artifact's modules emitted that way — every component and every
layout primitive in it — and the test suite could not see it, because the suite compiles this
package's sources, and sources contain JSX.

- `tsconfig.build.json` states `jsxImportSource: "nativewind"`, so a component's `className`
  reaches the runtime that turns it into a style.
- `pnpm check:native-artifact` reads `dist` and fails when any published module imports
  `react/jsx-runtime`, or when no module imports the interop runtime at all. CI, the
  distribution workflow and the release path run it after the build, which is where this
  belonged: the tests cannot make this assertion, and the artifact is what a consumer installs.
- The build cleans `dist` before it compiles, which it did not do. The published 2.5.0 tarball
  carried 176 stale modules at the pre-2.3.1 flat paths — a second copy of every component,
  62 of them emitting through React's runtime.

**The preset: `@asheeui/native/tailwind-preset`.** The setup used to ask the consumer to write
three things by hand, and two of them could not be written correctly without knowing how their
package manager laid out `node_modules`.

```js
// tailwind.config.js
const asheeui = require("@asheeui/native/tailwind-preset");

module.exports = {
  presets: [asheeui],
  content: ["./src/**/*.{ts,tsx}", ...asheeui.content],
};
```

- It chains NativeWind's own preset, states the eight colour roles at the framework's light
  palette (`defaultColorConfig.light`, which is what the web renderer paints from — a test
  keeps the copy honest), and states the package's own compiled modules as **absolute** globs.
  An absolute glob is the fix for the second half of the install trap: `@asheeui/native` is not
  at `node_modules/@asheeui/native` under pnpm, Bun's isolated installs or npm with a different
  peer set, and a documented relative glob matched nothing, so a consumer who followed the
  advice exactly still compiled none of the framework's classes.
- `content` is exported as well as declared because Tailwind v3 does not merge a preset's
  `content` into a configuration that states its own; the spread is what carries it.
- `asheeui/tailwind-preset` re-exports it, so an application that installed the umbrella — and
  therefore cannot reach the native package by name — states the same setup. `./package.json`
  is exported on both packages, for the tooling that reads a manifest to discover a version.

**The diagnosis: `verifyNativeWind()`.** Every failure in this area has one shape, an unstyled
screen with nothing to read. The provider now checks the pipeline once in a development build
and warns with the cause it found: it compares the runtime the framework's own components use
against React's, then asks NativeWind's `verifyInstallation()` about the Babel transform, the
compiled stylesheet data and its preset. `verifyNativeWind()` returns the same report as data
for a test or a script. A production bundle and a test run carry none of it.

**Toolchain.** The package's own `tailwindcss` devDependency was v4, which NativeWind v4 cannot
compile with and which the docs never told a consumer to install — the preset could not even be
loaded in this repository until it moved to v3.4, the line a consumer runs.

**Docs.** The native setup page now states the stylesheet import, the interop pairing
(`nativewind` 4.2.7 ships `react-native-css-interop` 0.2.7, and a pin of your own silently
disables every style), the preset, a role's required colour form for opacity modifiers, and the
five causes of an unstyled screen in the order they are worth checking. The package README's
documentation links pointed at a `docs/native.md` that no longer exists in the repository and
returned 404 to an anonymous visitor; they point at the site now.
