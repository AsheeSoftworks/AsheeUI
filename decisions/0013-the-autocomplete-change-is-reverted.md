# 0013. The autocomplete change is reverted

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-09-16 |
| Area | Library |
| Evidence | packages/ui/src/components/autocomplete/Autocomplete.tsx restored to a81e565; .changeset/autocomplete-option-type.md removed |

## Context

Record 0010 added `AutocompleteOption` to the library, because `Autocomplete`'s public
props named `MenuOption`, which is internal by design. The finding is real: a
consumer cannot name the type its handler receives. The change was reviewed before
release, and the owner preferred the library to carry no new public type for it now.

## Decision

The library change is reverted and its changeset is removed. The published surface
stays exactly as `2.0.0` shipped it, and the branch carries no library change. The
documentation site keeps the workaround it already had, which reads the handler's
parameter types from the component's own props and therefore needs nothing from the
package.

## Alternatives considered

Publishing the type in a patch release was rejected by the owner for now. Leaving
the change on the branch, unreleased, was rejected: a public API change that nobody
has agreed to is a trap for whoever merges the branch later. Closing the finding
entirely was rejected: the gap is recorded in `0010` and stays visible.

## Consequences

The branch contains documentation and decisions only. Consumers still cannot name the
option type of an autocomplete handler, and the demos' `ComponentProps` workaround is
the documented path until a release chooses to address it deliberately.
