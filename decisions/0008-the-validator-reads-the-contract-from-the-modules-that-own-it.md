# 0008. The validator reads the contract from the modules that own it

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-09-16 |
| Area | Documentation site |
| Evidence | asheeui-website scripts/validate.mjs |

## Context

`package.json` ran `scripts/derive.mjs` and `scripts/validate.mjs`, and the second
file did not exist: the branch had replaced the script that enforced the content
standard without adding its successor, so `pnpm verify` could not pass regardless of
the content.

## Decision

The validator is implemented, and it reads the page types, the sections and the
required frontmatter keys out of `lib/docs/page-types.ts` and `lib/site/site.ts`
rather than restating them. It checks what a build discovers late and a reader
notices immediately: missing frontmatter, an unknown type or section, an order that
is not a number or that collides inside a section, and a body that uses an h1.

## Alternatives considered

Copying the constants into the script was rejected: two lists of one contract drift,
and the drift is silent. Importing the TypeScript modules from a script was rejected
because the script would then need a loader the repository does not have. Skipping
validation was rejected: the standard is what makes a page type meaningful.

## Consequences

A page type added to the site is a page type the validator enforces, with no second
edit. The script treats a fenced block as an example, so a shell comment is not
mistaken for a heading, which was the one false positive it produced before that
rule was added.
