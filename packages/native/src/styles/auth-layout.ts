/**
 * The platform's class dictionaries for auth-layout.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/layouts/auth-layout/auth-layout-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { ContainerSize } from "@asheeui/core";

/**
 * The native shell.
 *
 * The web states a minimum height in viewport units, because a document page grows with what it
 * holds and has to be told not to be shorter than the window. A native screen is given its
 * height by the platform, and the shell is what fills it, so the shell grows instead. The media
 * column is placed by the component rather than by a breakpoint variant: the platform has no
 * media query, so `useBreakpoint` decides whether the two regions sit side by side.
 */
export const NATIVE_AUTH_LAYOUT_CLASS = "flex-1 w-full flex-col bg-background";

/**
 * The shell once the window is wide enough for the media column to sit beside the form.
 * The web divides the shell with a two-column grid at the same width.
 */
export const NATIVE_AUTH_LAYOUT_SPLIT_CLASS = "flex-row";

/**
 * The native form column.
 *
 * The web states its padding in two steps, because a browser window is usually much wider than
 * the text it holds; a screen is not, so the platform keeps the one step.
 */
export const NATIVE_AUTH_FORM_COLUMN_CLASS = "flex-1 flex-col p-6";

/** Centres the native form column vertically. */
export const NATIVE_AUTH_FORM_COLUMN_CENTERED_CLASS = "justify-center";

/**
 * The native form wrapper, which owns the measure of the form.
 * The web centres it with a margin; the platform centres it as a box in its parent.
 */
export const NATIVE_AUTH_FORM_WRAPPER_CLASS =
  "flex w-full flex-col gap-6 self-center";

/** The panel treatment of the form wrapper. */
export const NATIVE_AUTH_PANEL_CLASS =
  "rounded-md border border-border bg-background";

/** Padding of the native panel. */
export const NATIVE_AUTH_PANEL_PADDING_CLASS = "p-6";

/**
 * The native media column.
 *
 * The web states its minimum height in rem; the platform states it in the units its own scale
 * uses, at the step the shared spacing scale names. It takes half of the shell when the columns
 * sit side by side, which is what the web's two-column grid gives it.
 */
export const NATIVE_AUTH_MEDIA_COLUMN_CLASS =
  "flex-1 items-center justify-center overflow-hidden bg-secondary/40 min-h-[192px]";

/** The row under the form, for a link to the other authentication route. */
export const NATIVE_AUTH_FOOTER_CLASS = "items-center";

/**
 * Maximum width of the native form wrapper at each content width.
 *
 * The widths are the platform's container widths rather than the web's, so `contentSize` states
 * the same measure here as a `Container` of that size does on the same platform. A screen is
 * usually narrower than a desktop window, so a form is as wide as the screen long before any of
 * these caps matter; they decide what a tablet shows.
 */
export const NATIVE_AUTH_CONTENT_SIZE_CLASS: Record<ContainerSize, string> = {
  sm: "max-w-xl",
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-7xl",
  full: "max-w-full",
};
