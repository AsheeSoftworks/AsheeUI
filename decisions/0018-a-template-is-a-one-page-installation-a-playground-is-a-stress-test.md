# 0018. A template is a one-page installation, a playground is a stress test

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-09-16 |
| Area | Documentation, CLI |
| Evidence | packages/cli/templates, apps/*-playground, packages/cli/scripts/sync-playground-templates.mjs, packages/cli/tests/playground.test.ts |

## Context

The owner stated what the two things are for. A **template** is a one-page simple
installation: what a reader receives when they scaffold a project, showing that the
framework is installed and working. A **playground** is the real test of the framework:
it pushes AsheeUI until something breaks, which is how defects are found.

The repository does not work that way today. Each template is **generated from its
playground** by `sync-playground-templates.mjs`, and `tests/playground.test.ts` asserts
that the committed template equals a fresh generation file for file and byte for byte.
A template is therefore a copy of the stress test, which is neither a one-page
installation nor a distinct thing.

## Decision

The two are separate artifacts with separate owners:

- a **template** is written by hand, is as small as a working installation allows, and
  is what `@asheeui/cli` ships;
- a **playground** is a full application whose purpose is to exercise the framework,
  including the parts that are awkward, and it is never the source of a template.

Generation from playgrounds is retired, and with it the byte-for-byte assertion. What
replaces the check is a test that each template installs, builds, and renders, because
that is the property a template has to have.

## Alternatives considered

Keeping the generation and exempting Expo was rejected: the same artifact would then
mean two things depending on which template a reader picked. Keeping the generation and
letting a template equal its playground was rejected because it contradicts the purpose
of each. Generating a *skeleton* from the playground and adding template-only files was
rejected as the worst of both: the template would still drift with every playground
change, and the reader would still receive the stress test.

## Consequences

The three existing templates have to be rewritten as one-page installations, the sync
script retired, and the equality test replaced. A native template can be written now but
cannot be offered by the CLI until `@asheeui/native` is published, because it is
`private: true` with source-only exports and a template whose dependency cannot be
installed is not a template. The playground is unaffected by that: it lives in this
repository and reaches the package through the workspace.
