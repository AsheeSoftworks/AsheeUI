# 0003. One file declares the palette

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-09-16 |
| Area | Both sites |
| Evidence | as-site asheeui.config.ts; the documentation site's data/tokens.json |

## Context

The two sites had to look like one company, and the AsheeUI documentation site already had a palette: neutral surfaces with a single warm accent, declared in its own token file and resolved through the framework.

## Decision

Each site declares its colours once, in `asheeui.config.ts`, as light and dark values for the framework's semantic tokens. No page states a colour, and no component is styled with a palette class.

## Alternatives considered

Copying hex values into the company site's stylesheet was rejected: two sources of one palette drift. Introducing a design-token build step was rejected: the framework already resolves tokens through configuration, so a third mechanism would only be a second place to look.

## Consequences

A palette change is one file per site. The company site and the library's documentation cannot disagree about what the accent is.
