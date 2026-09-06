# Contributing to AsheeUI

Thanks for taking the time to contribute. AsheeUI is a community-driven React
component library, and every issue, pull request, and documentation fix makes
the project better for everyone.

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.
All community members are expected to follow it in every interaction.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Repository Setup](#repository-setup)
- [Development Workflow](#development-workflow)
- [Changeset Workflow](#changeset-workflow)
- [Pull Request Protocol](#pull-request-protocol)
- [Commit Guidelines](#commit-guidelines)
- [Code Style & Documentation](#code-style--documentation)

## Prerequisites

- [Node.js](https://nodejs.org) 20 or newer.
- [pnpm](https://pnpm.io) 9 or newer. The repository pins an exact version
  through the `packageManager` field, and `corepack enable` is recommended so
  the correct pnpm version is used automatically.

## Repository Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/ashee-softworks/asheeui.git
cd asheeui
pnpm install
pnpm build
pnpm test
```

The repository is a pnpm + Turborepo monorepo with these publishable packages:

| Package | Purpose |
| --- | --- |
| `asheeui` | React component library (`packages/ui`) |
| `@asheeui/cli` | Scaffolding and doctor/fix CLI (`packages/cli`) |
| `@asheeui/next` | Next.js integration (`packages/next`) |
| `@asheeui/vite` | Vite plugin (`packages/vite`) |
| `@asheeui/utils` | Shared utilities (`packages/utils`) |

## Development Workflow

1. Create a feature branch off `main` (see
   [Pull Request Protocol](#pull-request-protocol)).
2. Make your changes. Keep them focused on a single issue or feature.
3. Run the workspace scripts from the repository root:

```bash
pnpm build   # build all packages
pnpm test    # run every package test suite
pnpm lint    # run Biome linting and fix issues
pnpm format  # format the codebase
```

4. Add or update tests for any behavior change. New exported APIs must ship
   with TSDoc/JSDoc annotations and an `@example`, per the
   [commenting standards](docs/commenting.md).
5. Generate a changeset when you modify any `packages/*` code.

## Changeset Workflow

Every pull request that introduces changes to `packages/*` must include a
changeset. Changesets drive the versioning and publishing pipeline, and they
give maintainers an explicit record of what changed and why.

To create one:

```bash
pnpm changeset
```

The interactive prompt will ask you to:

1. **Select the affected packages** using the space bar.
2. **Choose the semver bump type** for each package:
   - `patch` for bug fixes and documentation updates.
   - `minor` for backward-compatible features.
   - `major` for breaking changes.
3. **Enter a clear summary** describing the change. Use imperative mood, for
   example: "Add support for custom card image components."

Commit the generated `.changeset/*.md` file together with your code changes.
Do not remove changeset files that belong to other open pull requests.

## Pull Request Protocol

1. Create a feature branch off `main`:

```bash
git checkout main
git pull origin main
git checkout -b feat/my-change
```

2. Implement your change, then make sure everything passes:

```bash
pnpm lint
pnpm test
```

3. Commit your work with a clear, descriptive message (see
   [Commit Guidelines](#commit-guidelines)).
4. Push the branch and open a pull request:

```bash
git push origin feat/my-change
```

5. Complete the pull request checklist in the PR template. Expect at least one
   maintainer review before the change is merged.
6. After merging, a maintainer runs the release flow so your changeset becomes
   a published version.

### Pull Request Checklist

- [ ] Code builds and all tests pass locally.
- [ ] A changeset is included when `packages/*` code changed.
- [ ] New or changed public APIs are documented with JSDoc and an `@example`.
- [ ] Changes follow the existing code style enforced by Biome.
- [ ] Commits are small, focused, and clearly described.

## Commit Guidelines

- Use the imperative mood in the subject line ("Add X", "Fix Y").
- Keep the subject under 72 characters.
- Use conventional prefixes when helpful, for example `feat:`, `fix:`,
  `docs:`, `refactor:`, `chore:`.
- Reference the related issue number in the body when applicable.

## Code Style & Documentation

- TypeScript and formatting rules are enforced by
  [Biome](https://biomejs.dev). Run `pnpm check` before pushing.
- Do not introduce logic changes alongside pure documentation changes.
- Public components, hooks, functions, and types must follow the project
  JSDoc standards documented in [docs/commenting.md](docs/commenting.md).
- Never use em-dashes or en-dashes in JSDoc blocks, comments, or markdown.
  Use plain hyphens or colons instead.

## Questions

If you have a question about contributing, open a discussion or reach out at
`asheeui@gmail.com`.
