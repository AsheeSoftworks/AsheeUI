# 0020. A dependency pull request generated against an older main is closed, not merged

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-09-16 |
| Area | Library |
| Evidence | Fifteen open pull requests on `AsheeSoftworks/AsheeUI`: thirteen npm majors, one actions group, one release. Every npm branch rewrites `pnpm-lock.yaml`, most of them removing thousands of lines against a main that has since gained the playground's dependencies. `git diff origin/main...origin/dependabot/npm_and_yarn/typescript-7.0.2` shows `typescript: ^5.0.0 -> ^7.0.2` with 3,693 lockfile lines deleted. The actions branch is already in main, which uses `actions/checkout@v7`, `pnpm/action-setup@v6` and `actions/setup-node@v7` in all three workflows. |

## Context

The repository's dependabot configuration groups minor and patch bumps and deliberately
leaves majors ungrouped so each is reviewed on its own. That works, and the queue is
what it produces: thirteen majors waiting for a reviewer, plus one actions group and one
release pull request.

They cannot be taken as they stand, and the reason is not the versions. Each npm branch
carries a `pnpm-lock.yaml` that was generated when main was older, so the diff against
main is mostly removal: the branches would delete the entries added since, including the
playground's. They also all rewrite the same lockfile, so they cannot be merged one after
another without the second one undoing the first, and the versions they propose are
majors across the whole toolchain at once, where a single one of them is a migration.

Two more facts decided the rest. The release pull request would publish a version, and
publishing is deferred by the owner, so merging it would do the one thing the project has
decided not to do yet. The actions group is already in main.

## Decision

A dependabot pull request is merged only when its branch is current with main and its
lockfile diff is an addition rather than a removal. One generated against an older main
is closed, and the weekly run proposes it again against current main, which is where it
belongs.

A major is taken as a project with the test suite and the build as the gate, never as a
pull request that happens to be green.

## Alternatives

Merging the ones that look routine. Reading the lockfile diff is what shows there are
none: the size of the deletion is the size of what main gained after the branch was cut.

Taking all of them in one deliberate upgrade. That is the right way to take them and the
wrong day to do it, and it is a project rather than a merge.

Ignoring majors in `dependabot.yml` so they stop arriving. Rejected: the weekly pull
request is how a major is noticed at all, and a queue that is closed by hand is smaller
than a queue that is never opened.

Deleting the branches. GitHub refuses it. Dependabot's branches are protected, and the
only way to remove the proposal is to close the pull request.

## Consequences

The queue is emptied by closing the pull requests. The routine groups return on the next
weekly run, generated against the main that exists then, and they will be mergeable. The
majors return too, until one is taken, and each is closed again with the same reason: not
declined, not yet, and not like this.

Nothing about the versions is lost. Every dependency state that was proposed is one
`pnpm update` away on a current main, which is also the only way to find out what the
migration costs.
