---
"@asheeui/native": patch
"@asheeui/puck": patch
"@asheeui/cli": patch
"asheeui": patch
---

Typecheck is a workspace gate: every published package now answers to `check-types`, `turbo run
check-types` builds a package's dependencies before checking it, and CI runs the task after lint.

The repository had two scripts (`@asheeui/core` and `@asheeui/web`), so four packages — native, the
umbrella, puck and the CLI — could break a rename without any command noticing. A build does not
substitute: each package compiles its own sources, and the consumer that breaks is a different
package. That is why the umbrella and puck map `@asheeui/*` to a dependency's `dist/index.d.ts`: their
`check-types` reads the *published* type, which is the contract a consumer sees, so the task depends
on `^build` rather than on the dependency being built by hand.

`@asheeui/native` and `@asheeui/puck` check `tsconfig.build.json` rather than `tsconfig.json`, matching
`@asheeui/core`. Their `tsconfig.json` includes tests, and both packages' tests reach into another
package's *source* (the web package's test harness; core's DOM helpers through a source path), which
neither package's `rootDir` nor its platform `lib` can hold. Checking what the package ships is the
honest gate today; the test files themselves are the next batch's work.

The stale `apps/expo-playground` override leaves `biome.json` with it: the directory was removed with
the playground, and an override that matches nothing is a rule nobody can see is not running.
