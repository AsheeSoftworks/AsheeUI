# 0009. The 2.0 component renames are applied to the demos

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-09-16 |
| Area | Documentation site |
| Evidence | asheeui-website a0bea2d; registry/demos, docs/components |

## Context

The restored demos and component pages were written for `0.7` and `1.0`, and the site
compiles them against the installed `2.0.0`. Four names the old content uses are no
longer exported: `Select`, `DatePicker`, `TextArea` and `PasswordInput`. The
substitution configuration for a custom component also changed from `props` to
`componentProps`.

## Decision

The renames are applied mechanically across the demos, the demo directories and the
preview paths inside the pages: `Select` becomes `Dropmenu`, `DatePicker` becomes
`Calendar`, `TextArea` becomes `Textarea`, and `props` becomes `componentProps`. The
`password-input` page and its two demos are removed, because the package does not
export that component and a page cannot document an export that does not exist.

## Alternatives considered

Pinning the site to an older release was rejected: its purpose is to document the
version a consumer installs. Renaming the imports while leaving the demo directories
under their old names was rejected: a preview path would then name a directory that
no longer describes the component. A prose pass over the 26 component pages was
deferred rather than rejected: the derived prop tables are current, and the prose is
a separate piece of work.

## Consequences

The 253 demos compile and the component pages resolve. The renames are
consumer-visible breakages worth a migration note, which is recorded as open rather
than assumed to be documented.
