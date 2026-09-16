# 0017. The launch does not claim the method is published, and two deployment defects are fixed

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-09-16 |
| Area | Both sites, documentation |
| Evidence | as-site 6431592; asheeui-website dd34f5f; ashee-ui README.md, docs/licensing.md, docs/published-process.md |

## Context

The owner stated the rule directly: the methodology the project is developed with is
created by Ashee Softworks and published openly, and the launch must not say the second
half yet. Two deployment failures arrived in the same session: the documentation site
stopped while prerendering a page because the manifest it reads is generated and the
build script never generated it, and the company site stopped before building because
its lockfile had gone stale when a package left `package.json`.

## Decision

**The language rule.** No site and no public document claims that the method, the
algorithm, the specification or the measurements are published, open, public or
available for others to adopt. Where such a claim belongs to a proposal about a future
institution, it is stated in the conditional: the standard "would be published", the
foundation "would publish" research. Nineteen sentences changed across the phase voice,
the page metadata, the content model, eight pages of the company site, the release
signal and the page about how the library is built. What is genuinely published is
untouched: the package on npm, the repository, the Apache-2.0 licence and the fact that
the library's source is open.

**The defects.** The documentation site's `build` and `dev` scripts run the derive step
first, because the manifest the pages read is generated from the installed package and
is never committed. The company site's lockfile is regenerated whenever `package.json`
changes, which is what a frozen install in a deployment requires. Both sites dropped a
custom `Cache-Control` header for the build output, because the platform sets that
caching itself and warns that a custom value changes behaviour.

## Alternatives considered

Removing the pages that describe the method was considered and not done: the owner asked
for that description in the library README two steps earlier, and the instruction was
about the claim of publication rather than about the description. Keeping the sentence
"published openly" in the library's licensing page was rejected: it is the exact claim
the owner named. Committing the derived manifest so a clean checkout can build without
the derive step was rejected: the file is build output, and committing it would let the
documentation disagree with the installed package. Pinning the whole dependency tree
with an exact lockfile check in CI was rejected as more machinery than the problem
needs.

## Consequences

A clean checkout builds both sites with the commands the platform runs, verified from
an empty generated directory and with a frozen lockfile. The method is still described
in the library README and in the documentation site's page about how the library is
built, so if the launch should not describe the method at all, those two places are the
remaining work and are now the only ones. A shareable, generic version of the hosting
script exists at the workspace root, carrying no project names, hostnames or business
detail.
