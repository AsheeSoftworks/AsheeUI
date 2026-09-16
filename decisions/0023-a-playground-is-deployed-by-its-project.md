# 0023. A playground is deployed by its project, and the project is linked to this repository

| Field | Value |
|---|---|
| Status | Accepted, supersedes 0022 |
| Date | 2026-09-16 |
| Area | Documentation, hosting |
| Evidence | The three playground projects carry `link: { type: github, repo: AsheeUI, productionBranch: main }` and deployed at the moment of the push. `ssoProtection` was `all_except_custom_domains` on each and is now null. `vite-playground` built `dist/client` while the Vite preset looked in `dist`; `outputDirectory` is now `dist/client`, and the project answers 200. The `next` and `vite` projects, both rooted at `packages/cli/templates/*`, were removed. |

## Context

0022 concluded that the playground projects were not connected to this repository, because
no deployment appeared to come from a push and every command-line deployment failed. That
conclusion was wrong, and the way it was reached is the part worth recording: the symptom
was read instead of the project.

Each project carries a GitHub link with `productionBranch: main`. Each deployed at the
moment of a push. And each command-line deployment failed for its own reason that had
nothing to do with the project: four transport errors from one machine, an upload that
reached the platform and was refused, a link that reset a connection.

There were four real faults, and each looked like the others:

- **Deployment protection.** Every project carried
  `ssoProtection: { deploymentType: "all_except_custom_domains" }`, so its URL answered with
  a redirect to a login and only a transient deployment URL was public. A site that requires
  authentication to render looks, from the outside, like a site that is broken.
- **One build at a time.** Three projects watch one branch, and the plan builds one at a
  time: the Expo deployment went READY and the Next and Vite ones were CANCELED at the same
  second. The production alias then points at a canceled deployment, which answers 404 while
  the project's dashboard entry says Ready.
- **The Vite output directory.** The application builds to `dist/client`, with its
  server-rendering entry beside it in `dist/server`, and the Vite preset serves `dist`. Every
  deployment succeeded and served nothing at its root: a 404 from a healthy project.
- **Two projects rooted at a template.** `next` and `vite` pointed at
  `packages/cli/templates/next` and `packages/cli/templates/vite`. A template is a file set a
  generator copies into somebody else's application; it has no dependencies of its own, so
  every one of those deployments failed with "No Next.js version detected". Removed, because
  `next-playground` and `vite-playground` are the applications and they are the ones that
  deploy.

## Decision

Read the project before drawing a conclusion about it: its git link, its root directory, its
build and output settings, and the state of its last few deployments. A push that deploys
nothing, a deployment that succeeds and serves nothing, and a project that has never built
are three different faults with three different owners, and only the project says which one
it is.

Configure the thing rather than work around it. The Vite playground was fixed by stating
where its build writes, not by moving its build; the protection was removed on the
playgrounds, which are demonstrations meant to be seen; and the two template-rooted projects
were removed rather than given build settings to imitate applications they are not.

## Alternatives

Deploying from a shell, which is what produced the four transport errors this record
inherited. The projects deploy from a push; the command line adds a path that has to be kept
working for no gain.

Adding a `package.json` to the templates so they could build as applications. That changes
what the generator writes into a consumer's project in order to serve a demonstration, and
0018 already decided that a template is a one-page installation rather than an application.

Leaving the protection on. A demonstration that asks for a login is not a demonstration.

## Consequences

All three playgrounds answer without authentication, and the Vite one serves its gallery.
The Next.js playground renders the frame the playgrounds were given, which is the change
that was being verified when this was found.

The habit that follows: a failed deployment is read from the deployment log and the project
settings in that order, and a "Ready" project that does not answer is a question about its
output directory rather than about its build.

Open: the three playgrounds build one at a time on this plan, so a push that touches all
three leaves two of them waiting to be redeployed, and the native package's tests now run
where they previously could not start, which is what the next section of this repository's
work is about.
