# 0019. A failed deployment says what the platform refused

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-09-16 |
| Area | Both sites |
| Evidence | Company site deployments of `6431592`, `1bac8ae`, `4f3949b` (all ERROR, on the advisory), then `70c6f41` READY. Documentation site `eccb38c` ERROR on the card, then `01adecd` READY. |

## Context

The identity work shipped, and the documentation site's deployment went from READY to
ERROR while the company site had been ERROR for three deployments in a row. The local
builds were no help: the documentation site panicked inside the bundler, and the same
build on the previous commit compiled and was then killed, with the machine holding
1.1 GB free. Two different failures that looked like one environmental failure.

Both real causes were only in the platform's build log, and neither was reachable from
the local output:

- The social card draws the wordmark the way the site does, with the accent on the
  second half. That made the element a parent of two children where it had been a
  parent of one string, and the image renderer refuses a multi-child element without
  an explicit display. The build stopped while prerendering the card, which is after
  every check that runs locally before a build and after the type checker.
- The company site carried a dependency in its lockfile that no file imports, at a
  version the platform scans for and refuses to publish. The build itself completed,
  so the last line of the log was an advisory rather than an error of the site's own,
  and the deployment failed with a log that looked like a success.

## Decision

Read the platform's build log before changing code. It names the refusal exactly, and
it is the only place that does.

A local failure is not evidence about a remote one. The panic, the kill and the two
real failures all arrived in the same hour, and treating them as one cost three builds
and a bisect. The local machine is not the deployment environment, and when it is under
memory pressure it fails in ways that imitate anything.

Keep the lockfile free of what nothing imports. A scanner reads the lockfile; the
imports are invisible to it.

## Alternatives

Reading the local panic as the cause, and bisecting further. It was the environment: the
previous commit compiled and then died on a signal with the machine nearly out of
memory, so no amount of bisecting would have found either real cause.

Pinning the unused dependency instead of removing it. Nothing imports it, so pinning
would have kept a package that a scanner can flag for no benefit at all.

Rendering the card's wordmark as one string again. That would pass, and it would give up
the accent on the second half, which is the wordmark the site uses everywhere else.

## Consequences

The card keeps its display and the dependency is gone, and both sites deploy.

The habit that follows: when a deployment fails, the first artifact to open is the
deployment's own log, and the second is the deployment of the commit before it. A site
that went from READY to ERROR between two commits is a statement about those two
commits, and a site that was ERROR before the change is a statement about something
else entirely.
