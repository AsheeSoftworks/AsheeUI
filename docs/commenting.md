# Commenting Guide

## Purpose

This document defines the commenting style for the AsheeUI codebase. Consistent comments across the monorepo ensure that hovering over any exported component, prop, hook, or type in an editor gives a contributor an accurate and useful description. This guide also ensures that future contributions and AI-assisted edits follow the same pattern.

## Format

All comments for exported symbols use TSDoc block comments (`/** ... */`), never `//` line comments. TSDoc is what powers editor hover tooltips and IntelliSense, which is the primary reason we write comments at all.

## What Must Be Documented

Every exported symbol in the codebase requires a TSDoc comment:

- Every exported component
- Every prop in every prop interface (documented individually, directly above the property)
- Every exported hook
- Every exported type and enum
- Every exported utility function

## File-level Headers

Every file starts with a short header comment (two to four sentences) describing what the file contains and where it fits in the AsheeUI architecture. Categories include: primitive component, complex component, config type, hook, or utility.

Example from `components/button/button-config.ts`:

```ts
/**
 * Button component configuration for AsheeUI.
 * This file defines the configuration types and defaults for the Button
 * component, including variant, color, size, radius, and behavior options.
 * It registers the default configuration with the component registry
 * and provides fallback values for the cascade resolution system.
 */
```

## Component Comments

Every component's doc comment must include:

1. What the component renders and its primary use case, in plain language
2. How it participates in the config-driven system: which props can also be set through component-level config or the global theme, and the precedence order (instance prop overrides component config, which overrides theme default)
3. Any accessibility behavior it handles automatically
4. An `@example` block showing basic JSX usage (short and realistic, no more than five or six lines)
5. An `@see` tag pointing to closely related components or config types where useful

Example from `components/button/Button.tsx`:

```ts
/**
 * A clickable element that triggers an action or event.
 *
 * Button supports multiple visual variants, theme colors, density and
 * radius scales, icon-only mode, loading state, and a press animation.
 * Visual tokens resolve through the standard AsheeUI cascade: prop,
 * component config, global theme defaults, and the built-in fallback.
 *
 * The component automatically handles accessibility attributes including
 * aria-disabled, aria-busy for loading states, and proper focus management.
 * Icon-only buttons should provide an aria-label for accessibility.
 *
 * @param props - Button configuration options and native button props.
 * @param props.variant - Visual style variant. Defaults to "bordered".
 * @param props.color - Theme accent color. Defaults to "primary".
 * @param props.size - Density scale. Defaults to "md".
 * @param props.radius - Corner rounding. Defaults to "md".
 * @param props.animate - Press animation. Defaults to true.
 * @param props.fullWidth - Full-width layout. Defaults to false.
 * @param props.isDisabled - Disabled state. Defaults to false.
 * @param props.isLoading - Loading state. Defaults to false.
 * @param props.type - Native button type. Defaults to "button".
 * @param props.icon - Icon-only compact layout. Defaults to false.
 * @param props.children - Button label content.
 *
 * @example
 * ```tsx
 * import { Button } from "asheeui";
 *
 * export function Example() {
 *   return (
 *     <Button
 *       variant="solid"
 *       color="primary"
 *       onClick={() => console.log("Clicked")}
 *     >
 *       Click me
 *     </Button>
 *   );
 * }
 * ```
 *
 * @see ButtonConfig - The configuration type for component defaults.
 * @see resolveVariantClass - Utility for resolving variant and color styles.
 * @see useAsheeConfig - Hook for accessing the global configuration.
 */
```

## Prop Comments

Prop comments are the most important part of the documentation. Each prop in every prop interface must have a comment directly above it, in this style:

```ts
interface ButtonConfig {
  /**
   * Visual style of the button.
   * Falls back to `theme.defaultVariant` when not set here or in component config.
   * @default "solid"
   */
  variant?: Variant;
}
```

For each prop, include as many of these as are true and relevant:

- One clear sentence on what the prop actually controls (not a restatement of the TypeScript type)
- `@default` when the prop has a default value (note where that default lives: component, component config, or theme)
- A note when the prop is config-overridable, and at which tier it can be set (prop, component config, or theme)
- A note when the prop is a `ResponsiveValue<T>` and can take breakpoint overrides
- A note on any constraint or coupling (for example, `icon: true` requiring `aria-label`, or a prop only having effect when another prop is also set)
- `@deprecated` only if the code shows it is no longer the recommended way to do something (do not guess)

### Config-overridable prop example

From `components/accordion/accordion-config.ts`:

```ts
/**
 * Visual style variant.
 * Controls the container and item appearance.
 *
 * @default "separated"
 */
variant?: AccordionVariant;
```

### Prop with default from component config

From `components/card/card-config.ts`:

```ts
/**
 * Placement of the card image.
 * Determines where the image appears relative to the content.
 *
 * @default "top"
 */
imagePosition?: InternalImagePosition;
```

### Prop with global theme fallback

From `components/button/Button.tsx` (props interface):

```ts
/**
 * Theme accent color.
 * Controls the color of the button's primary visual elements.
 *
 * @default "primary"
 */
color?: Color;
```

This prop can be set at any tier: instance prop overrides component config, which overrides the global `defaultColor` in the theme.

### Prop with coupling constraint

From `components/card/Card.tsx` (props interface):

```ts
/**
 * Alternative text for the card image.
 * Important for accessibility.
 *
 * @default ""
 */
imageAlt?: string;
```

## Hooks

Hook comments must include:

- Purpose of the hook
- `@param` for each parameter
- `@returns` for the return value
- Any side effects (subscriptions, caching, external store reads)
- Whether the hook is meant for consuming components or is internal to the library

Example from `theme/useTheme.ts`:

```ts
/**
 * React hook that provides access to the current theme state and controls.
 *
 * This hook subscribes to the theme controller and returns the current
 * theme selection, resolved theme name, and functions for changing the theme.
 * Components using this hook will re-render automatically when the theme changes.
 *
 * The hook uses useSyncExternalStore to safely subscribe to the theme
 * controller's state, making it compatible with React's concurrent rendering.
 *
 * @returns An object containing the current theme state and control functions.
 *
 * @example
 * ```tsx
 * function ThemeToggle() {
 *   const { theme, setTheme, availableThemes } = useTheme();
 *
 *   return (
 *     <select value={theme} onChange={(e) => setTheme(e.target.value as ThemeSelection)}>
 *       {availableThemes.map(t => (
 *         <option key={t} value={t}>{t}</option>
 *       ))}
 *       <option value="system">System</option>
 *     </select>
 *   );
 * }
 * ```
 *
 * @see ThemeController - The underlying class that manages theme state.
 */
```

## Types and Enums

Each type needs a short description of what it represents. For union types like `Variant`, `Color`, `Size`, or `Radius`, briefly describe what each member means when the name alone is not self-explanatory.

Example from `shared/variant.ts`:

```ts
/**
 * The available visual styles for components like Button.
 * Each variant represents a distinct visual treatment with different
 * background, border, and hover behaviors.
 */
export type Variant = "solid" | "ghost" | "bordered" | "faded" | "underlined";
```

Example from `components/card/card-config.ts`:

```ts
/**
 * Visual style of the card.
 *
 * - `elevated`: Box shadow elevation.
 * - `bordered`: Subtle outline border.
 * - `flat`: Solid neutral background.
 * - `ghost`: Transparent background without a border.
 */
export type CardVariant = "elevated" | "bordered" | "flat" | "ghost";
```

## Utility Functions

Utility function comments must include:

- Description of what the function does
- `@param` for each parameter
- `@returns` for the return value
- Any edge cases the function handles (empty input, merging behavior, precedence resolution, and so on)

Example from `utils/resolve-token.ts`:

```ts
/**
 * Resolves a value using the standard cascade precedence order.
 * Follows the hierarchy: instance prop > component config > global default > hard fallback.
 * This is the primary resolver for most component props.
 *
 * @param instance - The prop value passed directly to the component instance.
 * @param section - The value from the component's configuration section.
 * @param globalDefault - The global default value from the theme configuration.
 * @param hardFallback - The final fallback value if all others are undefined.
 * @returns The resolved value.
 *
 * @example
 * ```tsx
 * const variant = resolveCascade(
 *   props.variant,          // 'ghost'
 *   config.Button.variant,  // 'solid'
 *   theme.defaultVariant,   // 'faded'
 *   'solid'                 // hard fallback
 * );
 * // Returns 'ghost' because instance prop takes precedence
 * ```
 */
export function resolveCascade<T>(
  instance: T | undefined,
  section: T | undefined,
  globalDefault: T | undefined,
  hardFallback: T,
): T {
  return instance ?? section ?? globalDefault ?? hardFallback;
}
```

## Tone and Language Rules

Follow these rules consistently:

- Write for a contributor who has never seen this codebase before.
- No marketing language. Never describe anything as "powerful," "seamless," "blazing fast," or similar.
- Never use an em dash. Use commas, periods, or parentheses instead.
- Do not write a comment that only restates the type signature in English with no added information.
- Match existing terminology in the codebase (component config, theme default, resolveScale, ComponentConfigRegistry, and so on) instead of inventing new names for existing concepts.
- Keep prop comments to one to three sentences plus tags. Comments are references, not essays.

## Before-and-After Example

### Before

```ts
interface AccordionConfig {
  /** Visual style variant */
  variant?: AccordionVariant;
  /** Padding and spacing scale */
  size?: AccordionSizeKey;
  /** Corner rounding */
  radius?: Radius;
}
```

### After

```ts
interface AccordionConfig {
  /**
   * Visual style variant.
   * Controls the container and item appearance.
   *
   * @default "separated"
   */
  variant?: AccordionVariant;

  /**
   * Padding and spacing scale.
   * Controls the density of headers and content panels.
   *
   * @default "md"
   */
  size?: AccordionSizeKey;

  /**
   * Corner rounding.
   * Controls the border-radius of the container or individual items.
   *
   * @default "md"
   */
  radius?: Radius;
}
```

## Checklist for Reviewers

When reviewing new code, use this checklist to verify the commenting standard is followed:

- [ ] Every exported component has a TSDoc comment with purpose, config participation notes, accessibility notes, `@example`, and `@see` where relevant.
- [ ] Every prop in every exported prop interface has an individual TSDoc comment directly above it.
- [ ] Every exported hook has a TSDoc comment with purpose, `@param`, `@returns`, and side-effect notes.
- [ ] Every exported type and enum has a TSDoc comment describing what it represents.
- [ ] Every exported utility function has a TSDoc comment with purpose, `@param`, and `@returns`.
- [ ] Every file has a short file-level header comment.
- [ ] Every prop with a default value has an `@default` tag.
- [ ] Props that are config-overridable note which tiers they can be set at.
- [ ] No comments restate the type signature without adding information.
- [ ] No em dashes appear anywhere in comments.
- [ ] No marketing language appears anywhere in comments.
- [ ] Comments match existing codebase terminology.