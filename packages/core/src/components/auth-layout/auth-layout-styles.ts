/**
 * Every class string the AuthLayout renders, for both renderers, kept side by side so a change
 * to the shell's shape lands on both platforms at once. Every entry is a complete, static class
 * string, because both Tailwind and NativeWind compile the classes they can read in the source.
 */

import type { ContainerSize } from "../../shared/section-block";

// ─── Web ──────────────────────────────────────────────────────────────────────

/**
 * The shell: a full-height column that becomes two columns from the `lg`
 * breakpoint when the page has media.
 */
export const AUTH_LAYOUT_CLASS =
  "flex min-h-dvh w-full flex-col bg-background lg:grid lg:grid-cols-2";

/** The form column. */
export const AUTH_FORM_COLUMN_CLASS = "flex flex-1 flex-col p-6 md:p-10";

/** Centres the form column vertically. */
export const AUTH_FORM_COLUMN_CENTERED_CLASS = "justify-center";

/** The form wrapper, which owns the measure of the form. */
export const AUTH_FORM_WRAPPER_CLASS = "mx-auto flex w-full flex-col gap-6";

/** The panel treatment of the form wrapper. */
export const AUTH_PANEL_CLASS = "rounded-md border border-border bg-background";

/** Padding of the panel at each content width. */
export const AUTH_PANEL_PADDING_CLASS = "p-6 md:p-8";

/** The media column. */
export const AUTH_MEDIA_COLUMN_CLASS =
  "flex min-h-48 items-center justify-center overflow-hidden bg-secondary/40";

/** Puts the media column first from the `lg` breakpoint upwards. */
export const AUTH_MEDIA_FIRST_CLASS = "lg:order-first";

/** The row under the form, for a link to the other authentication route. */
export const AUTH_FOOTER_CLASS = "text-center";

/** Maximum width of the form wrapper at each content width. */
export const AUTH_CONTENT_SIZE_CLASS: Record<ContainerSize, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-xl",
  xl: "max-w-2xl",
  full: "max-w-none",
};

// ─── Native ───────────────────────────────────────────────────────────────────

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
