# 0021. The native package is compiled but never typechecked

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-09-16 |
| Area | Library |
| Evidence | `pnpm --filter @asheeui/native test` runs 0 tests and exits 1. `tsc -p packages/native/tsconfig.json` refuses with TS5108 (`moduleResolution=node10` was removed in TypeScript 7); with that option replaced the same command reports 92 errors. `apps/expo-playground/src/App.tsx` passed `disabled` to a native `Button` until `c405431`. |

## Context

The native package ships its source: `main` and `types` both point at `src/index.ts`, and
Metro and Babel are what turn it into an application. Nothing in the workspace runs a type
checker over that source, and the one command that would have — the package's own `tsc` —
had been unable to start since the platform removed `moduleResolution=node10`, so its
output was an error about the configuration rather than about the code.

What that hid was found while framing the Expo playground in the package's own layout kit:
the screen passed `disabled` to a `Button` that states the option as `isDisabled`, so the
disabled control the documentation claims had never been rendered by the screen that
exists to render it. Repairing the configuration then reported 92 errors, of which the
platform's `testID` and NativeWind's `className` are the recurring pair: the components
declare their props by omitting from the platform's, and the platform's type declarations
are reaching the package in a form that does not carry either.

## Decision

Treat the native package as a package that is compiled by its consumers rather than
verified in the workspace, and say so, instead of leaving a `tsc` configuration in place
that cannot run and that a reader would reasonably read as a check.

Verification of the native side rests on the playground: it builds, it exports to the web,
and it renders every component in every state the documentation claims. A statement about
mobile is therefore backed by a build and by the screen, not by a type check.

## Alternatives

Repairing the configuration and committing it with 92 errors open. That replaces "the
check cannot start" with "the check fails", which is worse for a reader, and it invites the
errors to be normalised rather than fixed.

Declaring the platform props the package relies on, which is what NativeWind publishes for
`className`. It removes six of the 92 and leaves the two that matter — `testID` and the
platform's own declarations — untouched, because they are missing for a reason that a
declaration in this repository does not address.

## Consequences

The native surface is verified by what it renders, and the divergences it hides are of a
kind that only a reader or a screen will catch: an option spelled differently from the web
control is invisible to a build that succeeds.

Open: a native type check worth running, which means resolving the platform's declarations
for the package on its own, and tests — the package has a Jest configuration that runs no
tests at all, so its layout kit, which the Expo screen now composes from, has no unit
coverage either.
