/**
 * AuthLayout component styles for AsheeUI.
 * This file provides the static class mappings for the authentication page
 * shell.
 */

import type { ContainerSize } from "../container/container-config";

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
