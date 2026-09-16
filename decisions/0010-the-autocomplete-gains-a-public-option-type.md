# 0010. The autocomplete gains a public option type

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-09-16 |
| Area | Library |
| Evidence | .changeset/autocomplete-option-type.md; packages/ui/src/components/autocomplete/Autocomplete.tsx |

## Context

`Autocomplete`'s `options` prop and its `onValueChange` callback named `MenuOption`.
`Menu` is internal by design and is never exported, so a consumer could not name the
type its own handler receives. The site's demo worked around that by reading the type
out of the component's props, which is a workaround a library should not require.

## Decision

The autocomplete declares and exports `AutocompleteOption`, structurally identical to
the internal menu option, and its public props use it. The internal type keeps its own
name and stays unexported. A patch changeset records the change.

## Alternatives considered

Exporting `MenuOption` was rejected: it would publish an internal component
deliberately kept out of the surface. Inlining the shape in the prop declaration was
rejected: the shape would then exist twice inside the package. Leaving the workaround
in the demo was rejected as a fix to the symptom.

## Consequences

A consumer can type an autocomplete handler without reaching into the package, the
type appears in the public typings, and the package's tests pass. The demo keeps its
workaround until the next release, because the site consumes the published version.
