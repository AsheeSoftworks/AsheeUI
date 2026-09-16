# 0015. The domains are split by product, and the previous branch stays out of production

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-09-16 |
| Area | Both sites |
| Evidence | as-site DOMAINS.md and scripts/setup-domains.sh; asheeui-website DOMAINS.md and scripts/setup-domains.sh |

## Context

Two products are published by one company: the library's documentation and the
company's own site. Each already had a Vercel project, and each repository's `main`
branch is the version that was live before this work. The owner asked for the `www`
variation of each hostname to be attached, for the two projects not to overlap, and for
the previous site to stay hidden.

## Decision

Each product owns two hostnames, and no hostname appears twice: `asheeui.com` and
`www.asheeui.com` on the documentation project, `asheesoftworks.com` and
`www.asheesoftworks.com` on the company project. The apex is canonical and the `www`
name redirects to it, which the sites already do in `next.config.ts`.

The assignment is enforced rather than remembered: `scripts/setup-domains.sh` in each
repository inspects the hostnames of both projects before it attaches anything, refuses
to take a hostname attached elsewhere, and never passes `--force`.

The previous site is kept out of production by setting the project's Production Branch
to the launch branch, so `main` is never built to production, and by leaving Vercel
Authentication on for preview deployments, so a preview of `main` is not reachable by a
shared URL. The old deployments are not deleted: they stop being served, which is what
hidden means here.

## Alternatives considered

Serving the documentation under the company's hostname was rejected: two products, two
codebases and two release rhythms do not belong on one canonical address, and the
documentation would then be indexed under a name the company may change. Wildcard
hostnames were rejected because a wildcard lets any subdomain answer for the project,
which is the overlap the owner asked to prevent. Forcing a hostname that is attached
elsewhere was rejected because a hostname in the wrong place is a decision to reverse,
not an error to override. Deleting the previous deployments was rejected: nothing needs
them gone, and the record of what was published has value.

## Consequences

Four hostnames, four DNS records or a nameserver change, and two production-branch
settings. The sites need `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_ALT_HOST` set to match
the DNS, or the canonical address in the markup will disagree with the address a reader
used. The remaining owner steps are the login, the DNS, and the two dashboard settings,
each listed in the repositories' `DOMAINS.md`.
