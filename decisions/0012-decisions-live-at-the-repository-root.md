# 0012. Decisions live at the repository root

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-09-16 |
| Area | Documentation |
| Evidence | decisions/ |

## Context

The decisions taken while building the two sites and updating this package were
recorded in commit messages, in the internal decision cache and in conversation. A
commit message explains a change; it does not carry the alternatives that were
rejected or what the choice leaves open.

## Decision

A `decisions/` directory sits at the repository root, holding an index and one
numbered record per decision. A record states its status, its date, the area it
affects, the evidence that shows it, the context, the decision, the alternatives
rejected with reasons, and the consequences.

## Alternatives considered

Appending to the internal decision cache was rejected: that cache belongs to the
development instance and is not committed, so the record would not travel with the
repository. One long document was rejected because a superseded decision would have
to be edited in place, which erases what was believed before. A wiki or an issue was
rejected because neither is reviewable in the change that implements the decision.

## Consequences

A decision is reviewable beside the change it produced, and a later reader can see
what was rejected rather than guessing. The register is additive: a changed decision
is superseded by a new record that names its predecessor.
