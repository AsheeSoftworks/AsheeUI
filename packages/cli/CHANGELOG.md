# @asheeui/cli

## 0.5.1

### Patch Changes

- Sync CLI version flag with package.json

## 0.5.0

### Minor Changes

- Add shorthand aliases for all CLI commands and refresh the CLI reference docs.
  
  - `init` → alias `i`
  - `list` → aliases `ls`, `l`
  - `doctor` → aliases `doc`, `dr`
  - `fix` → alias `f`
  
  docs: add standardized JSDoc annotations and complete component documentation

### Patch Changes

- Updated dependencies
  - @asheeui/utils@0.3.0

## 0.4.0

### Minor Changes

- Make CLI commands idempotent and add `list`/`fix` commands.
  
  - **init**: Running `init` multiple times no longer duplicates CSS imports, plugin registrations, provider wrappers, or generated config files.
  - **init**: Removed the `--local` flag and all local workspace dependency resolution.
  - **list**: New command that discovers and prints the components available in the installed `asheeui` package or a local registry path.
  - **fix**: New command that runs the `doctor` checks and automatically repairs config files, CSS imports, root providers, and missing peer dependencies without duplicating content.
  - **doctor/audit**: Shared audit helpers extracted so `doctor`, `init`, and `fix` use identical verification logic.
  - **deps**: Removed `framer-motion` from the CLI's peer dependency checks, prompts and installers; `@floating-ui/react` is now bundled by `asheeui`.
  - **deps**: Package-manager install helpers now consistently support `npm`, `pnpm`, `yarn`, and `bun` (including dev-dependency flags).
  - **templates**: Generated `asheeui.config.ts` matches the current `defineConfig`/`ExternalConfig` API used by the playground apps.

## 0.3.7

### Patch Changes

- Fix Card component prop
- Updated dependencies
  - @asheeui/utils@0.2.7

## 0.3.6

### Patch Changes

- Fix npm package export issues
- Updated dependencies
  - @asheeui/utils@0.2.6

## 0.3.5

### Patch Changes

- Fix ESM subpath export mappings and per-component build output structure.
  - Update `build-registry.ts` to map `./<component>` subpath exports to per-component runtime ESM files (`./dist/components/<name>/index.js`) instead of bundling everything into root `dist/index.js`.
  - Configure `vite.config.ts` to output single ESM target format (`formats: ["es"]`) with `preserveModules: true` and `preserveModulesRoot: "src"`.
  - Implement automated barrel generation plugin (`generateBarrels`) to restore per-directory `index.js` re-exports in `dist/`.
  - Export all 33 component modules from `src/index.ts`.
- Updated dependencies
  - @asheeui/utils@0.2.5

## 0.3.4

### Patch Changes

- Fix(build): align export maps, type declarations, and build targets across packages
  
  - Correct package.json exports, types, and publishConfig fields across all packages to point to actual dist/ build outputs (.mjs, .cjs, .d.mts, .d.cts)
  - Fix @asheeui/utils ESM import condition to point to dist/index.mjs, resolving Rolldown import resolution failure in start-playground
  - Configure @asheeui/cli as ESM-only package with dist/index.mjs and dist/index.d.mts targets
  - Correct publishConfig.module and publishConfig.types across @asheeui/next and @asheeui/vite
  - Set packages/ui/tsconfig.json rootDir to ./src to output per-component .d.ts declarations directly under dist/
  - Add copyStyles plugin and entryRoot configuration to packages/ui/vite.config.ts to emit dist/index.css and dist/index.js
  - Update build-registry.ts to generate publishConfig.exports matching actual emitted module and type files
- Updated dependencies
  - @asheeui/utils@0.2.4

## 0.3.3

### Patch Changes

- Update package.json types export
- Updated dependencies
  - @asheeui/utils@0.2.3

## 0.3.2

### Patch Changes

- Update package.json exports
- Updated dependencies
  - @asheeui/utils@0.2.2

## 0.3.1

### Patch Changes

- Fix build with utils package
- Updated dependencies
  - @asheeui/utils@0.2.1

## 0.3.0

### Minor Changes

- Fix build configs

### Patch Changes

- Updated dependencies
  - @asheeui/utils@0.2.0

## 0.2.1

### Patch Changes

- Fix tsdown buld for npm publish

## 0.2.0

### Minor Changes

- Improved integration with multiple react frameworks and Add cli
