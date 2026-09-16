# 0014. Search visibility is implemented, and its owner inputs are listed

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-09-16 |
| Area | Both sites |
| Evidence | as-site lib/seo.ts, lib/seo-pages.ts, lib/seo-metadata.ts, lib/structured-data.ts, app/robots.ts, app/sitemap.ts, app/manifest.ts, app/opengraph-image.tsx, app/llms.txt, app/privacy, app/terms, next.config.ts, SEO.md; asheeui-website app/manifest.ts, components/analytics.tsx, app/layout.tsx, next.config.ts, SEO.md |

## Context

Both sites needed search visibility, and the first site had a gap that is easy to miss:
its pages are client components, and a client component cannot export metadata, so
every route was publishing the root layout's title and description. The previous
configuration also carried a stale static sitemap, a `robots.txt` rewrite pointing at a
route that no longer existed, a package that rewrote the sitemap again after the build,
and a `www` host in one place and the apex in another.

## Decision

Search visibility is implemented in code, and every value only the owner can supply is
read from the environment. Per-page metadata lives in server layouts above the client
pages; a page whose phase has not arrived is served `noindex`; the sitemap lists only
revealed pages; a generated card follows the phase; structured data is built from the
values the pages render, including an event record that appears only once a real start
date is configured. Analytics are loaded only when an identifier is configured and,
by default, only after consent. Both sites carry an `SEO.md` that states what is
implemented and lists the owner's part as numbered tasks.

## Alternatives considered

Publishing the pages as server components was rejected for now: it would restructure
eleven pages to obtain metadata a layout can carry. Inventing event dates and venues
was rejected: an unverifiable event claim is the opposite of what these sites argue.
Leaving the analytics tag unconditional was rejected: a site whose argument is that
claims are checkable should not measure its readers without asking. A Content Security
Policy was deliberately not set, because a wrong policy breaks the site and a
permissive one only looks like assurance; the choice is listed for the owner.

## Consequences

A phase change now moves the navigation, the sitemap and the indexability of every
route together, so the reveal and the index cannot disagree. Two implementation defects
were found and fixed on the way: the retired `select` paths in the documentation had
also rewritten the `multi-select` demo paths, and the old sitemap package was writing a
file that contradicted the route. What remains is data, accounts and approvals, listed
in each site's `SEO.md`.
