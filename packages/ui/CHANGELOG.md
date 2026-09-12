# asheeui

## 0.7.0

### Minor Changes

- ### Floating layer standard (new)
  
  - Introduced a single floating-layer standard so portaled popups layer correctly against both AsheeUI components and arbitrary client components (including custom navbars), with no manual `z-index` configuration required.
  - Added `utils/stacking.ts`: `ASHEE_LAYER` (small per-layer deltas: `dropdown: 10`, `popover: 20`, `tooltip: 30`), `ASHEE_GLOBAL_LAYER` (fixed app-level rungs: `overlay: 1000`, `docked: 1500`, `toast: 2000`), `establishesStackingContext`, `resolveBaseZIndex`, and `resolveFloatingZIndex`. `establishesStackingContext` covers the full CSS stacking-context list (fixed/sticky, positioned + `z-index`, `opacity`, `transform`, `filter`, `backdrop-filter`, `perspective`, `clip-path`, `mix-blend-mode`, `isolation`, `will-change`, `contain`) and the ancestor walk crosses shadow DOM hosts. These are re-exported from the `utils` barrel.
  - Added the `useFloatingZIndex` hook (`libs/use-floating-z-index.ts`): derives a portaled element's `z-index` as `outermost stacking-context z-index of the trigger + layer delta`, measured in a layout effect so the corrected value lands before paint (no flash at the wrong layer). Floating UI virtual elements are ignored.
  - Anchored popups (Select, MultiSelect, Autocomplete, SelectMenu, DatePicker, Tooltip) now derive their `z-index` from the trigger's stacking context. A popup opened from a navbar renders above that navbar, while a popup opened from the page stays underneath it, regardless of the numeric `z-index` a client assigns to their chrome.
  - Removed the hardcoded floating `z-index` classes that the standard replaces: `z-30` (SelectMenu), `z-100` (DatePicker), `z-50` (Modal/Drawer), `z-9999` (OnScreenKeyboard), `z-99999` (Toast), and the tooltip's `z-99999` escape hatch.
  - App-level overlays now use the fixed `ASHEE_GLOBAL_LAYER` rungs instead of ad-hoc classes: Modal/Drawer `1000`, OnScreenKeyboard `1500`, Toast `2000`. Modal and Drawer now render above high `z-index` navbars.
  
  ### Tooltip
  
  - Added a `portal` option (default `false`). When `false` the tooltip renders in place next to the trigger and follows the trigger's own stacking context; when `true` it is appended to `document.body` via `FloatingPortal` for triggers inside scrollable or clipped containers. This is a behavior change from the previous always-portaled implementation.
  - Added a `zIndex` option (layer delta, defaults to `ASHEE_LAYER.tooltip`).
  - Portaled tooltips apply the derived `z-index`; in-place tooltips apply none, because they already follow the trigger's stacking context.
  
  ### SelectMenu / useSelectFloating
  
  - Added a `zIndex` option (defaults to `ASHEE_LAYER.dropdown`); the derived value is merged into the returned `floatingStyles`, so Select, MultiSelect, Autocomplete, and DatePicker layer correctly with no per-component wiring.
  - SelectMenu no longer hardcodes `z-30`; the value now arrives through `floatingStyles`.
  
  ### DatePicker
  
  - Passes `zIndex: ASHEE_LAYER.popover` to the shared floating hook and no longer hardcodes `z-100`.
  
  ### Modal / Drawer / OnScreenKeyboard / Toast
  
  - Switched to the shared `ASHEE_GLOBAL_LAYER` rungs (Modal/Drawer `overlay: 1000`, OnScreenKeyboard `docked: 1500`, Toast `toast: 2000`), replacing the per-component `z-50` / `z-9999` / `z-99999` classes so the overlay tiers are defined in one place.
  
  ### Modal (opening flicker fix)
  
  - Fixed the modal flickering when opening. The exit-animation flag was reset in a `requestAnimationFrame` callback, so the modal painted one frame with `animate-modal-out` before switching to `animate-modal-in`. Because `modalPopOut` starts at `opacity: 1` while `modalPopIn` starts at `opacity: 0`, the modal flashed fully visible, then disappeared, then faded in again on every re-open. The flag is now reset in the same batch as the mount, so the first painted frame already uses the enter animation.
  
  ### Card
  
  - Standardized the card's extended configuration into nested config/prop pairs with parent-prefixed names — `CardImageConfig` / `CardImageProps` for the embedded image and `CardLinkConfig` / `CardLinkProps` for the embedded link (config types live in `card-config.ts`, prop types extend them in `Card.tsx`). `CardConfig` holds `image: CardImageConfig`; `BaseCardProps` omits `image` from the config and `CardProps` re-adds it as `image?: CardImageProps`, plus `link?: CardLinkProps`.
  - Removed the flat `href`, `linkComponent`, `linkProps`, `imageComponent` and `imageProps` props (removed, not deprecated): `href` performed a full-page `window.location` navigation, which is incompatible with client-side routers. The image part is now `image={{ src, alt, component, props }}` and the link part is `link={{ component: NextLink, props: { href: "/pricing" } }}` (or pass only `props` to render a native `<a>`). Part `props` are spread last, so they take precedence over the component's own props.
  - Link cards keep the native activation behaviour of the element they render (e.g. Enter on an anchor); only button-like cards synthesise Enter/Space clicks.
  - `onClick` and a `link.props.onClick` now both run: the link handler is invoked from the card's own click handler instead of being spread onto the root, so the disabled guard and the card's `onClick` are never bypassed by link props.
  
  ### Button
  
  - Added `href` and `link` (`ButtonLinkProps` — `{ component?, props? }`) so the button can render as a link: when `href` or `link` is provided the root becomes an `<a>`, or `link.component` when given (e.g. `next/link`), instead of `<button>`. `type` and `disabled` are only applied to the `<button>` form — the link form uses `aria-disabled` and the disabled guard still blocks navigation. Link `props` are spread last so they take precedence, and a `link.props.onClick` runs alongside the button's own `onClick`.
  
  ### Image
  
  - Renamed the flat `imageComponent` / `imageProps` props to `component` / `props` (removed, not deprecated) so the Image component's embedded-component props match the nested part shape used by parents (`CardImageProps` exposes the same `component` / `props`).
  
  
  ### Sidebar
  
  - Standardized the sidebar's extended configuration into nested config/prop pairs:
    - `SidebarOptionsConfig` — `radius`, plus `active` (`SidebarActiveOptionConfig`) and `inactive` (`SidebarInactiveOptionConfig`), each carrying `variant` and `color`. `SidebarOptionProps extends SidebarOptionsConfig` and adds the sidebar-local `itemClassName`.
    - `SidebarTooltipConfig` — `show`, `placement`, `variant`, `color`. It carries no instance-only props, so no props type is created for it.
  - `SidebarConfig` now exposes `options?: SidebarOptionsConfig` and `tooltip?: SidebarTooltipConfig`. `BaseSidebarProps` omits `options` from the config and `SidebarProps` re-adds it as `options?: SidebarOptionProps`, plus `tooltip?: SidebarTooltipConfig`.
  - Removed the flat `itemRadius`, `itemVariant`, `activeItemVariant`, `activeItemColor`, `showTooltips`, `tooltipPlacement`, `tooltipVariant`, `tooltipColor` and `itemClassName` props (removed, not deprecated). Migrate e.g. `itemRadius="lg" activeItemColor="danger"` to `options={{ radius: "lg", active: { color: "danger" } }}`, and `showTooltips={false} tooltipPlacement="top"` to `tooltip={{ show: false, placement: "top" }}`.
  - Link handling is now a nested part too: `link?: SidebarLinkProps` (`{ component?, props? }`) replaces the flat `linkComponent` / `linkProps` props (removed, not deprecated) — e.g. `link={{ component: NextLink, props: { prefetch: true } }}`. `anchorProps` remains a flat typed passthrough.
  
  ### Modal / Drawer (slot props)
  
  - Nested the slot class overrides into part objects: `overlay?: { className }` and `content?: { className }` (`ModalOverlayProps` / `ModalContentProps`, `DrawerOverlayProps` / `DrawerContentProps`), replacing the flat `overlayClassName` / `contentClassName` props (removed, not deprecated). The base props now omit the DOM `content` attribute to make room for the `content` part.
  
  ### Select / Autocomplete / MultiSelect / DatePicker
  
  - Standardized the embedded-part types: each part now has a config type in its `*-config.ts` and a props type that extends it with instance-only props in the component file, exposed through the same key (omitted from the config-derived base props):
    - Select: `menu?: MenuProps` (was `MenuConfig`), so `menu.className` is now accepted.
    - MultiSelect: new `MultiSelectChipConfig` + `MultiSelectChipProps` (adds `className`), exposed as `chip?: MultiSelectChipProps`; `chip` is omitted from `MultiSelectConfig` in the base props. Chips now apply `chip.className`. `menu` keeps `MenuProps`.
    - Autocomplete: already used the pair (`menu?: MenuProps`) — uncovered by the standard.
    - DatePicker: `PickerConfig` → `DatePickerPickerConfig`, `PickerProps` → `DatePickerPickerProps` (adds `className`) and `PickerMode` → `DatePickerMode`; exposed as `picker?: DatePickerPickerProps`.
  
  ### Tabs
  
  - Standardized the tab item styling into `TabsOptionsConfig` — `active` (`TabsActiveOptionConfig`) and `inactive` (`TabsInactiveOptionConfig`), each carrying `radius`, `variant` and `color` — with `TabsOptionProps extends TabsOptionsConfig` adding `tabClassName`. `TabsConfig` exposes `options?: TabsOptionsConfig`; `BaseTabsProps` omits it and `TabsProps` re-adds `options?: TabsOptionProps`.
  - Removed the flat `activeRadius`, `activeVariant`, `activeColor` and `tabClassName` props (removed, not deprecated). Migrate `activeColor="danger"` to `options={{ active: { color: "danger" } }}` and `tabClassName="…"` to `options={{ tabClassName: "…" }}`. Inactive tabs are now configurable via `options.inactive`; the defaults preserve the previous `ghost` / `none` / container-radius look.
  
  ### Config resolution (hydration fix)
  
  - Fixed a server/client hydration mismatch where component `className` output differed. `resolveConfig` took a **snapshot** of the component-defaults registry while the provider resolved the config, so any component whose config module registered its defaults *after* that first resolve (common with code-split client chunks and per-route module graphs) fell back to the global defaults on the client while the server used its registered defaults — for example Chip `radius: "full"` registered vs `defaultRadius: "md"`, or the field-based `variant: "bordered"` registered vs `defaultVariant: "solid"`. `config.components` is now resolved lazily, so every access reflects the registry at the moment a component actually renders.

## 0.6.15

### Patch Changes

- update(doc): Remove unwanted section from Readme.md

## 0.6.14

### Patch Changes

- ### asheeui
  
  - Removed the stale top level `style` field from package.json. Style resolution is handled through the `exports` field, and the removed field pointed at a path that does not exist in the published package.
  
  ### Docs
  
  - Removed references to a local playground app that is not part of the published repository.
  - Added a short section to CONTRIBUTING.md explaining how to test local changes by building the package and linking it into a separate project.

## 0.6.13

### Patch Changes

- ### SelectMenu
  
  - Fixed dropdown lag when scrolling with the menu open by adding a `lockScroll` option (now enabled by default) that locks page scroll while the menu is open, using scroll-position-compensated `position: fixed` so the page doesn't jump
  - Fixed visible flash-then-snap on first open by gating the menu's enter animation on Floating UI's `isPositioned` state
  - Replaced manual `react-dom` `createPortal` usage with `@floating-ui/react`'s `FloatingPortal` for consistent focus-trap and nested-floating-element support
  - Extracted the option list into a memoized `SelectMenuOptionsList` component so position and other unrelated re-renders no longer re-create every option button
  - Fixed all toast/menu placements rendering at a single fixed corner by resolving placement per-instance instead of using one shared container (carried over from the Toast fix, applies to menu positioning generally)
  
  ### useSelectFloating
  
  - Set `strategy: "fixed"`, correct for elements portaled to `document.body`
  - Consolidated `useClick`, `useDismiss`, `useRole`, and `useInteractions` into the hook itself, so consumers (Select, and now DatePicker) no longer wire these individually
  - Hook now returns `getReferenceProps`/`getFloatingProps` directly alongside `refs`, `context`, `floatingStyles`, and `isPositioned`
  
  ### Select
  
  - Simplified to use the consolidated interaction props (`getReferenceProps`/`getFloatingProps`) from `useSelectFloating` instead of wiring `useClick`/`useDismiss`/`useRole`/`useInteractions` directly
  - Threaded `isPositioned` and `floatingStyles` through to `SelectMenu` to support the new anti-flash and positioning behavior
  
  ### DatePicker
  
  - Applied the same Floating UI fixes as SelectMenu: `FloatingPortal` in place of manual `createPortal`, `isPositioned`-gated enter animation, and scroll-position-compensated `lockScroll` (now enabled by default via `picker.lockScroll`)
  - Simplified the popover to use the consolidated `getReferenceProps`/`getFloatingProps` from `useSelectFloating` (with `role: "dialog"`) and spread `floatingStyles` on the floating node
  - Memoized the calendar grid (`Calendar`) so position and input re-renders no longer rebuild the month grid

## 0.6.12

### Patch Changes

- Remove unneccesary tests in asheeui

## 0.6.11

### Patch Changes

- ### SelectMenu
  
  - Fixed dropdown lag when scrolling with the menu open by switching Floating UI `strategy` to `"fixed"` and isolating the option list in a memoized `SelectMenuOptionsList`, so scroll-driven position updates no longer rebuild every option `Button` on each re-render
  - Fixed visible "jump then settle" flash on first open by keeping the menu hidden (`invisible opacity-0 pointer-events-none`) and applying the enter animation only once Floating UI's `isPositioned` state is true, so the reveal and the animation start together
  - Replaced manual `react-dom` `createPortal` usage with `@floating-ui/react`'s `FloatingPortal` for consistent focus-trap and nested-floating-element support
  - Added `isPositioned` prop to control initial-render visibility
  
  ### Select
  
  - Threaded `isPositioned` from `useSelectFloating` through to `SelectMenu` to support the new anti-flash behavior
  
  ### MultiSelect
  
  - Threaded `isPositioned` from `useSelectFloating` through to `SelectMenu` to support the new anti-flash behavior
  
  ### Autocomplete
  
  - Threaded `isPositioned` from `useSelectFloating` through to `SelectMenu` to support the new anti-flash behavior
  
  ### DatePicker
  
  - Applied the same Floating UI positioning and portal fixes as SelectMenu: `strategy: "fixed"` and `FloatingPortal` in place of manual `createPortal`
  - Gated the calendar popover's initial visibility and enter animation on Floating UI's `isPositioned` state to prevent a "jump then settle" flash and pop-in on first open
  
  ### Toast
  
  - Replaced manual `react-dom` `createPortal` usage with `@floating-ui/react`'s `FloatingPortal` for consistency with other floating components in the library

## 0.6.10

### Patch Changes

- ### Toast
  
  - Fixed toast placement bug where all toasts rendered at `top-right` regardless of the configured or per-toast `placement`
  - `ToastProvider` now groups active toasts by their resolved placement and renders one positioned container per placement, instead of a single container using the provider-level placement
  - Increased toast container `z-index` (`z-50` → `z-99999`) so toasts render above other portaled components
  - Added `PLACEMENT_CLASSES` to `toast-styles.ts`, mapping each `ToastPlacement` to its fixed-position and alignment classes
  - Added JSDoc comment to `PLACEMENT_CLASSES` documenting its purpose and usage

## 0.6.9

### Patch Changes

- ### Switch
  - Removed error state from Switch
  
  ### Autocomplete
  
  - Added comprehensive JSDoc comments to the Autocomplete component and its configuration file
  - Documented all component props with descriptions and default values
  - Added usage examples for different scenarios
  - Added `@see` references linking to related components
  - Applied consistent commenting style matching the existing Input component
  - Added file-level documentation headers
  - Organized code sections with consistent separator comments
  
  ### DatePicker
  
  - Added comprehensive JSDoc comments to all DatePicker component files
  - Documented all component props with descriptions and default values
  - Added usage examples for different scenarios
  - Added `@see` references linking to related components
  - Applied consistent commenting style matching the existing Input component
  - Added file-level documentation headers to all related files
  - Organized code sections with consistent separator comments
  - Added inline comments for complex logic sections
  
  ### Button
  
  - Added `startContent` and `endContent` props for icon/adornment slots
  - Updated documentation with new props and usage examples
  - Maintained existing behavior for loading states and icon-only mode
  
  ### Select
  
  - Refactored to use Button component as the trigger
  - Added `startContent` and `endContent` support via Input props
  - Extended Input field props (label, description, message, status, etc.)
  - Removed custom button implementation in favor of Button component
  - Updated component to follow DRY philosophy by reusing Input props
  
  ### MultiSelect
  
  - Refactored to use Button component as the trigger
  - Added `startContent` and `endContent` support via Input props
  - Extended Input field props (label, description, message, status, etc.)
  - Removed custom button implementation in favor of Button component
  - Updated component to follow DRY philosophy by reusing Input props
  - Consistent prop structure with Select component
  
  ### Input
  
  - Updated `enableVirtualKeyboard` prop to accept configuration options object
  - Added support for per-field keyboard customization (layout, size, variant, color, radius, portal)
  - Updated `useKeyboardField` usage to pass through keyboard options
  - Updated documentation with new prop type and examples
  
  ### Toast
  
  - Added per-toast styling options (placement, size, variant, radius, animated)
  - Extended `ToastShowOptions` to include styling overrides
  - Added default values to context for consumer access
  - Updated ToastItem to accept and apply per-toast styling
  - Refactored into separate files for better organization (ToastContext, ToastProvider, ToastItem)
  - Improved DRY principles with shared type definitions
  
  ### Keyboard
  
  - Refactored to be hook-controlled (similar to Toast system)
  - Added `disabled` prop for global keyboard disable
  - Added `KeyboardOpenOptions` for per-instance configuration
  - Updated `useKeyboardField` to accept configuration options
  - Auto-renders keyboard via provider (no manual placement needed)
  - Added per-keyboard styling (size, variant, color, radius, portal, layout)
  - Improved DRY principles with shared type definitions
  - Separated into multiple files (KeyboardContext, KeyboardProvider, OnScreenKeyboard)
  
  ## SelectMenu
  
  - Moved z-index from inline style to Tailwind class for better customization
  - Changed default z-index from inline `999999` to Tailwind class `z-100`
  
  # Changeset Summary
  
  ## Card
  
  - Added comprehensive JSDoc comments to Card component and configuration file
  - Documented all component props with descriptions and default values
  - Added usage examples for different scenarios (basic, clickable with image, background image)
  - Added `@see` references linking to related components
  - Applied consistent commenting style matching the existing Input component
  - Added file-level documentation headers
  - Organized code sections with consistent separator comments
  - Added inline comments for complex logic sections
  - Added `CardImageConfig` interface for standardized image configuration
  - Added `CardImageProps` extending config with `src`, `alt`, and custom `component` support
  - Added support for three image positions: `top`, `bottom`, and `background`
  - Added `ratio`, `fit`, and `loading` configuration options for images
  - Implemented background image rendering with absolute positioning
  - Added warning for potential rendering issues with custom image components
  - Fixed Next.js Image component compatibility issues

## 0.6.8

### Patch Changes

- Add lockScroll to the SelectMenu
  Update Modal to fit the whole screen
  Remove the redundant SelectOption type from SelectMenu

## 0.6.7

### Patch Changes

- 09de53d: Revert tooltip changes

## 0.6.6

### Patch Changes

- Fix Accordian overflow issue
  
  - Added `portal?: boolean` to the following component configs and props:
    - `SelectConfig` / `SelectProps`
    - `MultiSelectConfig` / `MultiSelectProps`
    - `AutocompleteConfig` / `AutocompleteProps`
    - `DatePickerConfig` / `DatePickerProps`
    - `ToastConfig` / `ToastProviderProps`
    - `TooltipConfig` / `TooltipProps`
    - `KeyboardConfig` / `KeyboardProviderProps` / `OnScreenKeyboardProps`
  
  - Added `portalTarget?: HTMLElement | null` to the following component configs and props:
    - `SelectConfig` / `SelectProps`
    - `MultiSelectConfig` / `MultiSelectProps`
    - `AutocompleteConfig` / `AutocompleteProps`
    - `DatePickerConfig` / `DatePickerProps`
    - `ToastProviderProps`
    - `SelectMenuProps` (direct prop only)
  
  - All relevant default configs and fallbacks now include `portal: true` and `portalTarget: null`.
  
  - New shared hook for Floating UI positioning used by Select, MultiSelect, Autocomplete, and DatePicker.
  
  - `Select` Now uses `useSelectFloating` hook and passes portal props to `SelectMenu`.
  
  - `MultiSelect` Now uses `useSelectFloating` hook and passes portal props to `SelectMenu`.
  
  - `Autocomplete` Now uses `useSelectFloating` hook and passes portal props to `SelectMenu`.
  
  - `DatePicker` Now uses `useSelectFloating` hook and conditionally renders popover content via `createPortal`.
  
  - `ToastProvider` Now conditionally renders toast container via `createPortal` based on `portal` prop.
  
  - `Tooltip` Now conditionally renders tooltip content via `FloatingPortal` based on `portal` prop.
  
  - `OnScreenKeyboard` Now conditionally renders keyboard via `FloatingPortal` based on `portal` prop.
  
  - `SelectMenu` Now accepts `portal` and `portalTarget` props and conditionally renders via `createPortal`.
  
  - Fixed consistent portal behavior All floating components now handle portal rendering consistently, with proper cascade resolution (prop > component config > fallback).
  
  - Fixed portal target resolution All components now resolve portal targets with proper fallback to `document.body` when available.
  
  - Fixed z-index consistency Updated z-index values across floating components to ensure proper stacking (z-50 for toasts, z-9999 for keyboard and select menus, z-999999 for date picker popovers).
  
  - Added TSDoc comments All new `portal` and `portalTarget` props are fully documented with explanations of when and why to use them.
  
  - Added component doc comments Updated component-level documentation to explain portal behavior and benefits.
  
  - Added examples JSDoc examples now show portal usage where relevant.
  
  
  -  Added `size?: KeyboardSizeKey` to `KeyboardConfig`, `KeyboardProviderProps`, and `OnScreenKeyboardProps`
    - `KeyboardSizeKey` is an alias for `Size` (`"sm" | "md" | "lg"`)
    - Default value is `"md"`
    - Follows the standard AsheeUI cascade: prop > component config > fallback
  
  - Fix ResizableScreen handle visibility when parent sizes are "auto". Use flexbox `self-stretch` for the separator and inner handle instead of
    percentage `h-full`/`w-full`, which can collapse when ancestor heights are
    not definite.
  - Remove the `ResizeObserver` based measurement and rely on CSS fallbacks
    (`minHeight` / `minWidth`) so the handle appears correctly even when
    children provide the container size.

## 0.6.5

### Patch Changes

- Fix wrong menu type in Autocomplete from SelectConfig to SelectMenuConfig

## 0.6.4

### Patch Changes

- Fix wronk menu type in Autocomplete from SelectConfig to SelectMenuConfig

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
