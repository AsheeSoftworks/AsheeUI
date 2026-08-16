# Changesets

This project uses [Changesets](https://github.com/changesets/changesets) for versioning and publishing.

## How it works

1. **Add a changeset** when you make changes that affect a package:
   ```bash
   pnpm changeset
   ```
   This creates a small markdown file in `.changeset/` describing your change.

2. **Version packages** when you're ready to release:
   ```bash
   pnpm version-packages
   ```
   This bumps versions based on your changesets and updates `CHANGELOG.md` files.

3. **Publish**:
   ```bash
   pnpm release
   ```
   This builds all packages and publishes them to npm.

## Semver guidelines

Since this is pre-beta, we're currently on `0.x.y`:

- `0.1.x` — patches / bug fixes
- `0.x.0` — new features / breaking changes (semver allows breaking in 0.x)

Once you hit `1.0.0`, standard semver applies:

- `patch` — bug fixes, backwards-compatible
- `minor` — new features, backwards-compatible
- `major` — breaking changes