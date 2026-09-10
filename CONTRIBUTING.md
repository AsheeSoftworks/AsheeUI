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
- [Testing Local Changes](#testing-local-changes)
- [Changeset Workflow](#changeset-workflow)
- [Pull Request Protocol](#pull-request-protocol)
- [Commit Guidelines](#commit-guidelines)
- [Code Style & Documentation](#code-style--documentation)
- [Adding a New Component](#adding-a-new-component)

## Prerequisites

- [Node.js](https://nodejs.org) 20 or newer.
- [pnpm](https://pnpm.io) 9 or newer. The repository pins an exact version
  through the `packageManager` field, and `corepack enable` is recommended so
  the correct pnpm version is used automatically.

## Repository Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/AsheeSoftworks/AsheeUI.git
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

## Development Workflow

1. Create a feature branch off `main` (see
   [Pull Request Protocol](#pull-request-protocol)).
2. Make your changes. Keep them focused on a single issue or feature.
3. Run the workspace scripts from the repository root:

```bash
pnpm build   # build every package and run the TypeScript checks
pnpm test    # run every package test suite (Vitest)
pnpm lint    # lint with Biome
pnpm check   # lint and check formatting with Biome
pnpm fix     # lint and format, writing fixes in place
```

There is no separate `typecheck` script. TypeScript is checked while packages
build, so run `pnpm build` before pushing. `pnpm test` currently runs the
Vitest suite in `packages/cli`.

4. Add or update tests for any behavior change. New exported APIs must ship
   with TSDoc/JSDoc annotations and an `@example`, per the
   [commenting standards](docs/commenting.md).
5. Generate a changeset when you modify any `packages/*` code.

## Testing Local Changes

There is no playground app committed to this repository. To try a change in a
real project, build the package and link it into a separate scratch project
with pnpm:

```bash
pnpm --filter asheeui build
cd ../scratch-app
pnpm link ../asheeui/packages/ui
```

Use `../asheeui/packages/cli` when you are working on the CLI. `pnpm link`
points the scratch project at the built package, so rebuild after each change.

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

A good changeset is short and specific. The front matter lists the packages and
the bump type, and the body describes the change in the same style used in
[CHANGELOG.md](packages/ui/CHANGELOG.md):

```markdown
---
"asheeui": patch
---

Fixed the SelectMenu dropdown lagging when the page scrolls with the menu open.
```

When a change spans packages, list each one in the front matter:

```markdown
---
"asheeui": minor
"@asheeui/cli": patch
---

Added the `Rating` component and taught the CLI to scaffold it.
```

## Pull Request Protocol

1. Create a feature branch off `main`:

```bash
git checkout main
git pull origin main
git checkout -b feat/my-change
```

Name branches with a short prefix and a description, for example
`feat/select-search`, `fix/toast-placement`, or `docs/readme-install`. Keep
each pull request focused on a single change so it is quick to review.

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

5. Link the issue your pull request resolves in the PR description (for
   example, "Closes #123"). If there is no issue, say so.
6. Complete the pull request checklist in the PR template. Expect at least one
   maintainer review before the change is merged.
7. After merging, a maintainer runs the release flow so your changeset becomes
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

TypeScript and formatting rules are enforced by [Biome](https://biomejs.dev).
Run `pnpm check` before pushing, or `pnpm fix` to apply fixes in place.

Do not mix logic changes with pure documentation changes in the same pull
request.

### JSDoc conventions

Every component file opens with a file-level header comment that describes what
the file contains. Public components, hooks, functions, and types document
their props with `@param`, list a runnable `@example`, and cross-link related
types and components with `@see`. The full standard lives in
[docs/commenting.md](docs/commenting.md).

The shape used across the library looks like this:

````tsx
/**
 * Select component for AsheeUI.
 * This file provides the main Select component implementation, which renders
 * a dropdown selector with search, label, validation, and configurable styles.
 */

/**
 * A dropdown selector with search, label, validation, and configurable styles.
 *
 * @param props - Select configuration options.
 * @param props.options - Available options to select from.
 * @param props.value - Controlled selected value.
 *
 * @example
 * ```tsx
 * <Select options={options} value={value} onValueChange={setValue} />
 * ```
 *
 * @see SelectConfig - The configuration type for component defaults.
 * @see Button - The button component used as the trigger.
 */
````

### Section separators

Inside a component file, use numbered separator comments to group the body into
readable steps. Keep the numbering, keep the spacing, and start at 1:

```tsx
// ─── 1. Resolve Config Values ─────────────────────────────────────────────────

// ─── 2. Render Field ──────────────────────────────────────────────────────────
```

### The cascade resolution pattern

Each component keeps its themeable values in a `*-config.ts` file next to the
component. That file defines the config type, exports a
`FALLBACK_<COMPONENT>_CONFIG` object for hard fallbacks, and registers the
defaults with `registerComponentDefaults`.

At render time the component resolves values with `resolveCascade`, passing
them in priority order: the instance prop first, then the component config,
then the global default, then the hard fallback. `resolveCascade` returns the
first value that is not `undefined`.

```tsx
const resolvedVariantKey = resolveCascade<Variant>(
  variant,                        // instance prop
  sectionConfig?.variant,         // components.select.variant
  config.defaultVariant,          // global default
  FALLBACK_SELECT_CONFIG.variant, // hard fallback
);
```

When you add a themeable prop, add it to the config type, give it a fallback
value, and resolve it through `resolveCascade`. Do not read the prop directly
in render if a config tier should be able to override it.

## Adding a New Component

Components follow a repeatable layout under
`packages/ui/src/components/<name>/`:

- `<Name>.tsx` for the implementation and its JSDoc header.
- `<name>-config.ts` for the config type, the `FALLBACK_<NAME>_CONFIG` object,
  and the `registerComponentDefaults("<name>", ...)` call.
- `<name>-styles.ts` for class maps when the component needs them.
- `index.ts` that re-exports the component and its public types.

To add one:

1. Create the folder and the files above, and resolve themeable values through
   the cascade described in the previous section.
2. Add `export * from "./components/<name>";` to
   `packages/ui/src/index.ts`, keeping the export list alphabetical.
3. Document the component and its props with the JSDoc structure above.
4. Add a changeset, because `asheeui` is a published package.
5. Link the package into a scratch project to confirm it renders in a real app,
   as described in [Testing Local Changes](#testing-local-changes).

## Questions

If you have a question about contributing, open a discussion or reach out at
`asheeui@gmail.com`.
