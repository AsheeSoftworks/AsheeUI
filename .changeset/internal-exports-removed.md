---
"asheeui": minor
---

Remove internal helpers that were public by accident.

The package root no longer exports `getInitials` (avatar), `getPaginationRange`
and the `PaginationRangeItem` type (pagination), or the radio group context
(`RadioContext`, `RadioContextValue`, `useRadioGroupContext`). Each of these
serves one component, is not documented as public API, and every other
component keeps its equivalent private.

Migration: stop importing them from `asheeui`. The components use them
internally and no public API depends on them. This is a pre-1.0 breaking change,
so no compatibility alias is provided.
