# 0011. The package documentation carries the plans

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-09-16 |
| Area | Documentation |
| Evidence | README.md, CONTRIBUTING.md, docs/published-process.md, docs/release-2.0.0.md, the pointer in each public document |

## Context

The library is the first thing a developer meets, and the plans describe what that
meeting should say: that the library was built with AI, that the process behind it is
published, and that the company maintaining it has a public position on standards and
responsibility. The repository's documentation said none of that.

## Decision

A new public document, `docs/published-process.md`, states how the library is built,
what the automated part may decide, what evidence a reader can check, and what the
page does not claim. The root `README.md` summarises it, `CONTRIBUTING.md` gains a
section on how work is produced and reviewed, `docs/release-2.0.0.md` records where
the release sits in the wider work, and every other public document carries one line
pointing to the new page.

## Alternatives considered

Putting the process in the README alone was rejected: fifteen documents would
describe a library whose production model appears in none of them. Rewriting the
component and installation documentation to carry the argument was rejected: an
installation page that argues about AI governance serves neither purpose.

## Consequences

The plans are stated once, in the document that owns the statement, and pointed at
from everywhere else. The internal model of the website repository is updated with
the two sites, the phase model and the rename findings, as its maintenance rule
requires.
