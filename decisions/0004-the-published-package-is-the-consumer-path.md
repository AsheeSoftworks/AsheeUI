# 0004. The sites consume the published package

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-09-16 |
| Area | Both sites |
| Evidence | both package.json files depend on asheeui ^2.0.0; neither links the workspace source |

## Context

The sites are the first real consumers of the framework, and the release had just been published. A workspace link would have hidden exactly the failures a consumer meets.

## Decision

Both sites install `asheeui` from the registry, so every API the sites use is an API a stranger can use, and every breaking change surfaces as a build error rather than as a difference between two copies of the source.

## Alternatives considered

Linking the workspace package was rejected as a shortcut that postpones the same work with less evidence. Vendoring components into the sites was rejected: it would test nothing.

## Consequences

The sites have no privileged access to unreleased fixes, so a fix has to be released before they can use it. The exercise found four consumer-visible breakages that a workspace link would have masked.
