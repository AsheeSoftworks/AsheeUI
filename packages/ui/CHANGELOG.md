# asheeui

## 0.4.1

### Patch Changes

- Remove Card component
  Remove tailwind classes card and muted
  Fix underline radius issues on components
  Update Sidebar component to have sections
  Update all Input components varients to default to the boarderd varient
  Fix micro bugs

## 0.4.0

### Minor Changes

- Remove all tokens including typogarphy, spacing, size and shadow
  Remove container, flex, grid, heading and text components
  Restructure config
  Update all components with the changes
  Remove framer motion

## 0.3.13

### Patch Changes

- Remove defaults from container component

## 0.3.12

### Patch Changes

- Add height to container
  Remove unnessesary defaults from components

## 0.3.11

### Patch Changes

- Fix theme not switching bug

## 0.3.10

### Patch Changes

- Fix Card component prop
- Updated dependencies
  - @asheeui/utils@0.2.7

## 0.3.9

### Patch Changes

- Fix theme/space relative path issue

## 0.3.8

### Patch Changes

- Add toggleTheme to ui

## 0.3.7

### Patch Changes

- Fix npm package export issues
- Updated dependencies
  - @asheeui/utils@0.2.6

## 0.3.6

### Patch Changes

- Fix React Server Component (RSC) boundary by adding the `"use client"` directive to the package entry point and a Rollup output `banner` so every emitted JS file carries the client directive.

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

- Fixed undefined behavior on missing custom theme values

## 0.2.0

### Minor Changes

- Improved integration with multiple react frameworks and Add cli
