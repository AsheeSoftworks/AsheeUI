# 0022. A playground is deployed by its project, not from a shell

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-09-16 |
| Area | Documentation, hosting |
| Evidence | Four command-line deployments of `next-playground`, `vite-playground` and `expo-playground` failed in four different ways: `ETIMEDOUT` after an 85.6 MB upload, `Internal Server Error` (HTML where JSON was expected), `ECONNRESET` on `vercel link`, and `fetch failed`. The three projects list no domain and no deployment of their own. |

## Context

The playgrounds are the framework's demonstration, and the three web ones render the same
shared application, so a change to that application is a change to all of them. Deploying
them from this machine was attempted as the shortest path to showing the change on a live
address, and it failed at the transport layer before the platform's build ever started.

The failures are the environment's rather than the projects': four distinct transport and
API errors, one of them after a complete upload, on a machine that reaches the platform's
API unreliably while the two product sites deploy from the same account without trouble.
Taking any one of them as a statement about the project would have been wrong, and taking
the first one as a statement about the change would have been wrong twice.

## Decision

A playground is deployed the way the two sites are: the project is linked to this
repository in the platform's dashboard, and a push to the branch the project watches is
what deploys it. The dashboard is the only place the link can be made — the API refuses
the field — so the step belongs to whoever holds the account, and the work that follows it
is the push.

Until a project is linked, a change to a playground is verified locally: the gallery's
contract tests, its own build, and the package's exported web build for the native one.

## Alternatives

Retrying the command line with a compressed upload. Tried: the upload completed and the API
then answered with an internal error, so the retry moved the failure rather than removing
it.

Treating the first failure as a defect in the change. The change was to one file that the
contract tests cover, and the failure arrived before any build of it.

## Consequences

The playground projects show nothing until the linking is done in the dashboard, and a
push that looks like a deployment is not one: the projects are not connected to the
repository, so nothing about them appears in a check of this repository.

Open: the link, in the dashboard, for `next-playground`, `vite-playground` and
`expo-playground`; and a look at the project settings afterwards, since a project that
never had a deployment has never had its build settings exercised.
