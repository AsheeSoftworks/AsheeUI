# 0005. The legacy company site is preserved and excluded

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-09-16 |
| Area | Company site |
| Evidence | as-site legacy/, tsconfig.json exclude, 9ec5c42 |

## Context

The company site had a complete consultancy implementation: nine service pages, an
about page, a contact page, a legal hub, its own header and footer, its own data
modules and a set of animated home sections. The institutional site replaces what
those pages say about the company, so they cannot remain in the route tree.

## Decision

The superseded implementation is moved to `legacy/` inside the repository and
excluded from the build, rather than deleted. The routes, the components and the
content stay readable, and nothing of them ships.

## Alternatives considered

Deleting the implementation was rejected: a branch is not the place to destroy work
that may still be wanted for the services the company sells. Keeping the pages live
beside the new ones was rejected: a visitor would meet two different companies. A
separate branch was rejected because the old implementation would then depend on a
history that has already moved.

## Consequences

The repository carries code the build ignores. The exclusion is stated in
`tsconfig.json`, so it is visible rather than implied. If any of the consultancy
content returns, it returns as part of the institutional argument rather than as a
page that survived.
