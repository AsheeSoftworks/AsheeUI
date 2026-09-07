# asheeui

## 0.6.3

### Patch Changes

- Standardize component configuration and token resolution across the core
  `asheeui` package: components inherit their tokens from shared `*Config`
  types, dropdown menus are wired through the unified `SelectMenu` API, and
  solid-variant foreground colors are unified for dark-theme contrast.
  
  Add new shared `SelectMenuConfig`: added `select-menu-config.ts` with
    `menuVariant`, `color`, `radius`, and `size` tokens plus
    `FALLBACK_SELECT_MENU_CONFIG`, exported from the select-menu barrel.
  
  CMake `SelectMenu` resolves its own menu tokens: it now accepts `menuProps`
    and `menuConfig` instead of individual visual props (`variant`, `color`,
    `radius`, `size`) and applies the resolved tokens to the search input and
    option buttons consistently.
  
  Make`Select`, `MultiSelect`, and `Autocomplete` use the unified `SelectMenu`
    API: all three pass `menuProps` + `menuConfig` (no more legacy flat menu
    props on the menu element). `Select` and `MultiSelect` expose a single
    `menu?: SelectMenuConfig` override bag and delegate token resolution to the
    menu, and `Autocomplete` forwards its `menu` config section unchanged.
  
  Add config inheritance across all components component props now
    extend their corresponding config type instead of re
  
  Standardized token-resolution naming: the shared trigger tokens now use
    the canonical `resolvedVariantKey`/`resolvedColorKey`/`resolvedRadiusKey`/
    `resolvedSizeKey` .
  
  Add hover states to sharered variant
  
  Add detailed commenting and documentation

## 0.6.2

### Patch Changes

- Fix Sidebar default inactive item color

## 0.6.1

### Patch Changes

- Fix AsheeUIProvider name change
  Add vitest tests to asheeui

## 0.6.0

### Minor Changes

- Refactor the monorepo architecture to remove the framework-specific plugins
  (`@asheeui/next`, `@asheeui/vite`) and the standalone utilities package
  (`@asheeui/utils`), moving to a clean, framework-agnostic setup.
  
  **Highlights**
  
  - **Removed bundler plugins** — `@asheeui/next` (`withAsheeUI`) and
    `@asheeui/vite` (`asheeui()`) are gone from the workspace. Runtime config is
    no longer injected through `virtual:ashee-config` build shims, so apps no
    longer need to modify `next.config.*`, `vite.config.*`, or `app.config.*` to
    use AsheeUI.
  
  - **Consolidated shared utilities** — `cn`, `mergeObject`, and `DeepPartial`
    now live inside core `asheeui` and are exported from the package root (and
    the `asheeui/utils` entry point). Projects that depended on `@asheeui/utils`
    should switch to `asheeui` directly.
  
  - **Added `AsheeUIProvider` and `useAshee`** — runtime theme and component
    configuration is now managed explicitly through React Context. Wrap your app
    once and pass your config object:
  
    ```tsx
    import { AsheeUIProvider } from "asheeui";
    import config from "./asheeui.config";
  
    <AsheeUIProvider config={config}>{children}</AsheeUIProvider>;
    ```
  
  - **Updated `@asheeui/cli`** — init/doctor/fix templates no longer install or
    wire up the removed plugin packages. Projects are scaffolded with the
    plugin-free setup and their app roots are wrapped with
    `<AsheeUIProvider config={config}>`.
  
  **Migration notes**
  
  - Remove `@asheeui/next`, `@asheeui/vite`, and `@asheeui/utils` from your
    `package.json` and bundler configs.
  - Replace `<AsheeUIProvider>` with `<AsheeUIProvider config={...}>` at your app
    root (passing the object from your `asheeui.config.*` file), or let
    `npx asheeui init` / `npx asheeui fix` rewire the provider for you.

## 0.5.0

### Minor Changes

- docs: add standardized JSDoc annotations and complete component documentation

### Patch Changes

- Updated dependencies
  - @asheeui/utils@0.3.0

## 0.4.8

### Patch Changes

- Fix Card component image positioning and border radius issues.
  
  - **Top/bottom image radius**: Top images now correctly show no radius on bottom corners, and bottom images show no radius on top corners.
  
  - **Background image rendering**: Background images are now rendered directly in an absolutely positioned container with `inset-0` and `z-0`, ensuring they properly fill the entire card behind the content without affecting layout or causing visual artifacts.

## 0.4.7

### Patch Changes

- Fix `Image` component reliability issues and add custom image component support (e.g. `next/image`) to `Image` and `Card`.
  
  **New:**
  - `Image` and `Card` now accept `imageComponent` (an `ElementType` to render instead of the native `<img>` tag) and `imageProps` (extra props forwarded to it).
  - When `imageComponent` is set and no `width`/`height`/`fill` is supplied via `imageProps`, `Image` automatically applies `fill: true` and a default `sizes="100%"`, since the component is container/ratio driven rather than intrinsic-size driven.
  - Dev-only console warnings guide consumers when a custom image component is missing explicit sizing, or when `src` is empty/undefined (custom components like `next/image` throw synchronously on an invalid `src` rather than firing `onError`).
  
  **Fixed:**
  - Skeleton no longer gets stuck indefinitely on load. Previously, `onLoad`/`onError` compared the browser-normalized `e.currentTarget.src` against internal state, which never matches for relative URLs — causing `isLoaded` to never flip to `true`. The rendered image element is now `key`-ed on `currentSrc` instead, so a stale event from a superseded `src` can't affect the current element, and load/error handling no longer relies on URL string comparison.
  - Skeleton no longer inherits the image's opacity/transition classes, which previously could make the skeleton itself invisible while `isLoaded` was `false`.
  - Cached images (where the browser marks `<img>` as `complete` before React attaches listeners) are now detected on mount, so `isLoaded` resolves correctly instead of leaving the skeleton visible for an already-loaded image.
  - `fallbackSrc` is now validated as a non-empty string before use, preventing a second failure when `fallbackSrc` itself is empty.
  - `Image` no longer crashes when passed a custom image component (e.g. `next/image`) with an empty or undefined `src` — rendering is skipped and the skeleton stays visible until a valid `src` is provided, instead of throwing "Expected a non-empty string" during render.
  - Fixed a React warning ("props object containing a key prop is being spread into JSX") by passing `key` as a literal JSX attribute on `ImageComponent` rather than including it in the spread props object.
  - `Card`'s `imageComponent`/`imageProps` are now forwarded to its internal `Image` for all three image positions (`top`, `bottom`, `background`).

## 0.4.6

### Patch Changes

- Change imageComponent and linkComponent type to `React.ElementType` to support components with differing prop signatures.

## 0.4.5

### Patch Changes

- Add `linkComponent` and `linkProps` props to Sidebar component to allow using framework-specific link components (e.g., Next.js Link, TanStack Router Link) while preserving all styles and interactions.
  Add `linkComponent` and `linkProps` props to Link component to replace the native `<a>` with custom routing components.
  Add `imageComponent` and `imageProps` props to Image component to use custom image components (e.g., Next.js Image) while keeping skeleton, fallback, and styling behaviors.

## 0.4.4

### Patch Changes

- Remove image possition left and right from Card component

## 0.4.3

### Patch Changes

- Fix Image component infinite loading issue
  Add Card component

## 0.4.2

### Patch Changes

- Remove radius from Drawer component
  Remove size xl
  Centralize Size, Radius, Color and Variant types in component configs with component-specific aliases
  Add UnderlineRadius helper and enforce radius none when variant is underlined
  Fix layout gap in `bordered`, `separated`, and `ghost` Accordion variants by removing redundant `overflow-clip` clipping on item containers.
  Add customizable on and off icons to PasswordInput componenet
  Fix overlay and content color missing in Modal component
  Redesigned resize handle and fixed dragging lag in ResizableScreen component
  Add collapsible controls, collapse button visibility, default collapsed state, omit full radius, and fix icon centering in collapsed mode to the SIdebar component

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
