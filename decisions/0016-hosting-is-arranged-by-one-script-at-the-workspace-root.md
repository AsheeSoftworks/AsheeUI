# 0016. Hosting is arranged by one script at the workspace root

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-09-16 |
| Area | Both sites |
| Evidence | ../setup-hosting.sh; as-site and asheeui-website DOMAINS.md |

## Context

Attaching four hostnames, writing the environment variables the sites read, keeping the
previous branch out of production and protecting preview deployments spans two
repositories, two Vercel projects, four DNS records and two dashboard settings. The
owner asked for one script whose only input is a token, and the Vercel CLI has no
command for the production branch: `vercel git` offers connect and disconnect only, so
that setting exists in the dashboard or the API and nowhere else.

## Decision

One script at the workspace root, `setup-hosting.sh`, does the whole arrangement: the
token is the only value to paste; it resolves both projects by name, enforces the
overlap rule, attaches the apex and the `www` hostname of each, writes the environment
variables both sites read (skipping every optional value that is empty), points each
project's production at the launch branch, protects preview deployments, asks Vercel to
build the launch branch, adds the DNS records when Vercel holds the zone, verifies the
domains, and prints the part that is accounts and decisions rather than code.

It is safe in the ways that matter:

- the token is validated before anything is changed, so a rejected token changes nothing;
- a hostname attached to the other project stops the run instead of being taken, and
  `--force` is never used;
- the production branch is set by reading the project's own git link, changing one
  field and sending the rest back unchanged, so a property the script does not know
  about cannot be lost;
- where the API does not report that field, nothing is changed and the dashboard step
  is printed, because a guessed field name could silently alter the git link;
- the deploy step is skipped unless production is confirmed to come from the launch
  branch, so the push cannot turn `main` into production;
- `DRY_RUN=1` prints the whole plan and changes nothing, and the script checks what it
  has already done on every run, so running it twice is safe.

## Alternatives considered

Guessing the production-branch field name was rejected: the cost of being wrong is a
silently altered git connection. Using `--force` to move a hostname was rejected for the
same reason the per-repo scripts refuse it. Keeping a copy of the script inside each
repository was rejected because two copies drift, so the root script is the only one and
the repositories' `DOMAINS.md` files point at it. Automating the registrar's DNS and the
search consoles was rejected as impossible without the owner's accounts, so the script
prints exactly what to do and reads the resulting value from the top of the file on the
next run.

## Consequences

The script lives outside the repositories, because it is an operator tool for this
workspace rather than part of a product. It was verified with a syntax check, a dry run
that prints the plan, a run without a token, and a run with a token Vercel rejects;
that last test found the one defect in it, an empty token in the file overriding a token
passed in the environment, which is why the token is now read as `${VERCEL_TOKEN:-}`.
The per-repository `setup-domains.sh` scripts remain for domain-only work.
