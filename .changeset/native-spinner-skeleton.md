---
"@asheeui/core": minor
"@asheeui/native": minor
"@asheeui/web": patch
---

Native gains `Spinner` and `Skeleton`, and the compatibility matrix gains an
enforcer, so a component the matrix promises for native cannot go missing.

- `@asheeui/native` implements the two components with its own mechanism rather
  than a web one with the browser removed. `Spinner` draws its ring from the
  theme's classes and rotates it with React Native's `Animated` on the native
  thread, because a platform activity indicator takes a colour *value* while the
  contract names a colour *role*: a control that cannot resolve the role would
  take the prop and ignore it. `Skeleton` mirrors the shared pulse contract and
  stays hidden from assistive technology unless it is labelled.
- `@asheeui/core` gains the `spinner` and `skeleton` modules those two share with
  the web: the configuration both platforms agree on and the class strings each
  renderer compiles, native and web side by side. Both renderers read one source,
  so a change to either scale is one edit.
- `@asheeui/web` points its spinner and skeleton at those shared class maps. The
  rendered markup and the public props are unchanged.
- `scripts/check-native-parity.mjs` reads the compatibility matrix at its source
  and asks what `@asheeui/native` publishes, by following the package's re-exports
  from its entry point. It fails when a component the matrix promises for native
  is neither exported nor queued, when an exported component still sits in the
  queue, and when the queue names a module the matrix does not promise for native.
  The queue lives in `scripts/native-parity.json` and may only shrink: shipping a
  queued component fails the check until its entry is removed. `pnpm
  check:native-parity` runs it locally, `--list` prints the whole expectation
  table, and CI runs it on every change.
