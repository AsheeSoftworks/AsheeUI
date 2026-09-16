# 0002. The reveal is a phase model, not several sites

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-09-16 |
| Area | Company site |
| Evidence | as-site lib/phase.ts, app/page.tsx, components/coming-soon.tsx, components/site-shell.tsx |

## Context

The strategy needs the site to say more as the launch approaches, and to say almost nothing at the start.

## Decision

Six ordered phases live in `lib/phase.ts`: coming-soon, signal, direction, algorithm, event and launch. Every route declares the phase that reveals it, and one reading of the current phase drives the navigation, the footer, the actions, the sections of each page, and the holding page a locked route renders instead.

## Alternatives considered

Several deployments, or a branch per phase, was rejected: the phases differ in content rather than in code, and a branch would fork every fix. Environment-based flags at each call site were rejected: the decision would then be spread across the pages instead of stated once.

## Consequences

A phase change is one line. The holding page is the same view for every locked route, so nothing is hidden inconsistently. A reviewer can read `lib/phase.ts` and know exactly what the site is allowed to say.
