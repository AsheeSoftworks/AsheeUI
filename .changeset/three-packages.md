---
"@asheeui/ui": minor
"@asheeui/core": minor
"@asheeui/web": minor
"@asheeui/native": minor
"@asheeui/cli": patch
---

Split the library into a platform-neutral core, a web renderer and a native renderer,
behind one entry point that routes to the right one.

- `@asheeui/core` is new: the platform-neutral layer, built by Vite, that both platforms consume. It holds the design language, the component contracts, the compatibility matrix, the component registry, the cascade, the configuration pipeline, and the class dictionaries each renderer compiles. It depends on no platform and imports no React runtime. It replaces `@asheeui/shared`, which was a source-only folder rather than a package a consumer could install.
- `@asheeui/web` is the DOM renderer: the React components, the icons, the Puck integration and the theme binding that reads the document and browser storage.
- `@asheeui/native` is the React Native renderer. It consumes `@asheeui/core` instead of `@asheeui/shared`, and it no longer defines its own Button class strings: both renderers' strings now live in core, side by side, so a change to the scale is one edit.
- `@asheeui/ui` is the umbrella entry point over the two renderers, and it is a new name rather than the one the library published under: the unscoped `asheeui` package is superseded rather than kept, so the entry point a consumer installs is scoped like the rest of the family. Its `main` reaches `@asheeui/web`, and its `react-native` field — with the `react-native` condition of its exports map and the `.native.ts` sibling Metro resolves — reaches `@asheeui/native`. An import of `@asheeui/ui` therefore names a component once and works on both platforms, and a browser bundle never contains React Native.
- `@asheeui/cli` follows the new package names in the imports it writes and in the theme checks it runs.

Import specifiers change once: the umbrella import `asheeui` becomes `@asheeui/ui`, `asheeui/styles` becomes `@asheeui/web/styles` and `asheeui/puck` becomes `@asheeui/web/puck`. `@asheeui/shared` is gone; its contracts, tokens and helpers are in `@asheeui/core`, which both `@asheeui/ui` and `@asheeui/web` re-export.

The CLI resolves project paths independently of the separator, so the config import
it writes and the file paths in its reports are the same on Windows as they are on
macOS and Linux.
