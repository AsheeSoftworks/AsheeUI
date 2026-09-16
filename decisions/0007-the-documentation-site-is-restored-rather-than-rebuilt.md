# 0007. The documentation site is restored rather than rebuilt

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-09-16 |
| Area | Documentation site |
| Evidence | asheeui-website a0bea2d; docs/ and registry/ restored from main |

## Context

The documentation site's working branch, which derives its data from the installed
package, had deleted all 33 published pages and all 253 demo files while the
refactor was in progress, and its `validate` script was referenced by
`package.json` but absent. The site compiled but could not prerender, because a
route read a page that no longer existed.

## Decision

The deleted content is restored from `main` and then migrated to the contract the
branch defines: frontmatter for the title, description, type, section and order;
the body's h1 removed because the title owns it; the component pages and demo
directories renamed to what 2.0 exports.

## Alternatives considered

Rewriting the documentation from scratch was rejected: the existing pages are the
documentation, and the branch's own contract says so. Declaring the branch
unbuildable was rejected: the gap is content, and content can be restored. Leaving
the pages without frontmatter was rejected because the site's standard requires it.

## Consequences

The site validates 34 pages, typechecks and builds. The prose of the component
pages predates 2.0 in places while the derived rows are current, so a prose pass
remains open and is recorded as such.
