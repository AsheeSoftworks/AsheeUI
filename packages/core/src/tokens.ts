/**
 * Design tokens for AsheeUI, expressed in platform-neutral values.
 *
 * This file is the design language's source of truth. It holds numbers and names,
 * never a class name, a style object or a DOM or React Native type, so the web
 * package (Tailwind) and the native package (NativeWind) can each map the same
 * scale into their own technology without either owning the definition.
 *
 * A platform maps a step to its own unit: the web scale is expressed in rem
 * through Tailwind's spacing scale, and the native scale in density-independent
 * pixels. `SPACING_STEP` therefore holds the Tailwind spacing step, which is the
 * shared vocabulary both platforms speak ("step 4" rather than "1rem" or "16dp").
 */

/**
 * The spacing scale's steps.
 * A step is the Tailwind spacing multiplier: step 4 is 1rem on the web and four
 * density-independent pixels on native, which is why the step and not the unit is
 * shared.
 */
export const SPACING_STEP = {
  none: 0,
  xs: 1,
  sm: 2,
  md: 4,
  lg: 6,
  xl: 8,
  "2xl": 12,
} as const;

/**
 * The shared spacing token names.
 */
export type Space = keyof typeof SPACING_STEP;

/**
 * Corner rounding, as a Tailwind radius token name.
 * Native maps these to its own radius values, and the native package keeps a
 * shadow copy only where the platform has no equivalent.
 */
export const RADIUS_STEP = {
  none: "none",
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
  full: "full",
} as const;

/**
 * The shared radius token names.
 */
export type Radius = keyof typeof RADIUS_STEP;

/**
 * The typography scale, as a Tailwind font-size token name.
 */
export const FONT_SIZE_STEP = {
  xs: "xs",
  sm: "sm",
  md: "base",
  lg: "lg",
  xl: "xl",
  "2xl": "2xl",
  "3xl": "3xl",
} as const;

/**
 * The shared typography size token names.
 */
export type FontSize = keyof typeof FONT_SIZE_STEP;

/**
 * Font weights the scale uses, as Tailwind weight token names.
 */
export const FONT_WEIGHT_STEP = {
  normal: "normal",
  medium: "medium",
  semibold: "semibold",
  bold: "bold",
} as const;

/**
 * The shared font weight token names.
 */
export type FontWeight = keyof typeof FONT_WEIGHT_STEP;

/**
 * The semantic colour roles every component resolves through.
 * A role is a name, not a value: each platform resolves it against its own theme
 * implementation, so light and dark mode and a consumer's own palette stay
 * available on both.
 */
export const COLOR_ROLE = {
  none: "none",
  primary: "primary",
  secondary: "secondary",
  danger: "danger",
  warning: "warning",
  success: "success",
} as const;

/**
 * The shared colour role names.
 */
export type ColorRole = keyof typeof COLOR_ROLE;

/**
 * The visual treatments a component may support.
 * A platform may resolve a treatment differently, and may resolve one it has no
 * use for to its nearest equivalent; it must not invent a treatment the other
 * platform cannot express.
 */
export const VARIANT = {
  solid: "solid",
  faded: "faded",
  bordered: "bordered",
  ghost: "ghost",
  underlined: "underlined",
} as const;

/**
 * The shared variant names.
 */
export type Variant = keyof typeof VARIANT;

/**
 * Density of a control or a surface.
 */
export const SIZE = {
  sm: "sm",
  md: "md",
  lg: "lg",
} as const;

/**
 * The shared size token names.
 */
export type Size = keyof typeof SIZE;

/**
 * Minimum touch target, in density-independent pixels.
 * A native control that is smaller than this is a defect rather than a style
 * choice, which is why the value lives with the design language instead of in one
 * component.
 */
export const MIN_TOUCH_TARGET = 44;

/**
 * The native elevation scale, expressed as a level rather than a shadow.
 * Web resolves a level to a Tailwind shadow utility and native resolves it to the
 * platform's own elevation or shadow, because a CSS box shadow has no meaningful
 * native equivalent.
 */
export const ELEVATION_LEVEL = {
  none: 0,
  sm: 1,
  md: 2,
  lg: 3,
} as const;

/**
 * The shared elevation level names.
 */
export type Elevation = keyof typeof ELEVATION_LEVEL;

/**
 * The responsive breakpoints, in the unit each platform measures in.
 * The names are shared so a developer learns one vocabulary; the numbers are
 * given in density-independent pixels, which the web maps to its own pixel
 * breakpoints and native maps to its window width.
 */
export const BREAKPOINT = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

/**
 * The shared breakpoint names.
 */
export type Breakpoint = keyof typeof BREAKPOINT;
