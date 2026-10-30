---
"@asheeui/native": patch
"@asheeui/puck": patch
"@asheeui/cli": patch
"asheeui": patch
---

Typecheck is a workspace gate: every published package answers to `check-types`, `turbo run
check-types` builds a package's dependencies before checking it, and CI runs the task after lint.

The repository had two scripts (`@asheeui/core` and `@asheeui/web`), so four packages — native, the
umbrella, puck and the CLI — could break a rename without any command noticing. A build does not
substitute: each package compiles its own sources, and the consumer that breaks is a different
package. That is why the umbrella and puck map `@asheeui/*` to a dependency's `dist/index.d.ts`: their
`check-types` reads the *published* type, which is the contract a consumer sees, so the task depends
on `^build` rather than on the dependency being built by hand.

Turning the gate on for native and puck surfaced test files that had never been checked. Both
packages now check `tsconfig.json` — tests included — everywhere, the way `@asheeui/web` and the CLI
already did:

- **Native** resolved `@asheeui/core` to its *source*, so a native program compiled core's
  DOM-reading modules with no DOM library and reported a `rootDir` violation per file. It reads
  core's built declarations now, as every other package does, which is what `tsconfig.build.json`
  already did.
- **Native's tests** were written against `@testing-library/react-native`'s earlier API. The v14
  renderer returns a promise, and the instance type it used to export as `ReactTestInstance` is
  `TestInstance`, from `test-renderer`. Twenty test files now say what the API says — `RenderResult`
  for a rendered tree, `TestInstance` for a node, `ReactElement` from React — instead of
  `ReturnType<typeof render>` and a type the package no longer exports. A press is delivered through
  one named helper rather than an unqualified `.parent`, so a tree with no host fails the test with
  a sentence instead of silently pressing nothing.
- **Puck's** rendered-page test imported the web package's test harness from that package's *source*
  subpath, which no compiler outside the package can resolve without compiling the whole renderer.
  The wrapper it needed is the provider and nothing else, over the public seam, so the test states it
  locally and checks its own program.

The stale `apps/expo-playground` override leaves `biome.json` with it: the directory was removed with
the playground, and an override that matches nothing is a rule nobody can see is not running.
