# @asheeui/utils

## 0.3.0

### Minor Changes

- docs: add standardized JSDoc annotations and complete component documentation

## 0.2.7

### Patch Changes

- Fix Card component prop

## 0.2.6

### Patch Changes

- Fix npm package export issues

## 0.2.5

### Patch Changes

- Fix ESM subpath export mappings and per-component build output structure.
  - Update `build-registry.ts` to map `./<component>` subpath exports to per-component runtime ESM files (`./dist/components/<name>/index.js`) instead of bundling everything into root `dist/index.js`.
  - Configure `vite.config.ts` to output single ESM target format (`formats: ["es"]`) with `preserveModules: true` and `preserveModulesRoot: "src"`.
  - Implement automated barrel generation plugin (`generateBarrels`) to restore per-directory `index.js` re-exports in `dist/`.
  - Export all 33 component modules from `src/index.ts`.

## 0.2.4

### Patch Changes

- Fix(build): align export maps, type declarations, and build targets across packages
  
  - Correct package.json exports, types, and publishConfig fields across all packages to point to actual dist/ build outputs (.mjs, .cjs, .d.mts, .d.cts)
  - Fix @asheeui/utils ESM import condition to point to dist/index.mjs, resolving Rolldown import resolution failure in start-playground
  - Configure @asheeui/cli as ESM-only package with dist/index.mjs and dist/index.d.mts targets
  - Correct publishConfig.module and publishConfig.types across @asheeui/next and @asheeui/vite
  - Set packages/ui/tsconfig.json rootDir to ./src to output per-component .d.ts declarations directly under dist/
  - Add copyStyles plugin and entryRoot configuration to packages/ui/vite.config.ts to emit dist/index.css and dist/index.js
  - Update build-registry.ts to generate publishConfig.exports matching actual emitted module and type files

## 0.2.3

### Patch Changes

- Update package.json types export

## 0.2.2

### Patch Changes

- Update package.json exports

## 0.2.1

### Patch Changes

- Fix build with utils package

## 0.2.0

### Minor Changes

- Fix build configs
