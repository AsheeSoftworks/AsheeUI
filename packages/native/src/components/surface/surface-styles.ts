/**
 * The class dictionaries the native surface is built from.
 *
 * They are internal to this package rather than part of the design language, because the
 * surface is a native answer to a native problem: a web control floats what it opens beside
 * itself, where the platform has one surface at a time. What the surface shows is still the
 * framework's — the field family's colours and densities — so the classes read the theme.
 */

/** The layer behind the surface, which dims the screen and dismisses it when pressed. */
export const NATIVE_SURFACE_BACKDROP_CLASS =
  "flex-1 items-center justify-center bg-foreground/30 p-4";

/** The surface itself, which holds a heading, its content and the controls that belong to it. */
export const NATIVE_SURFACE_SHEET_CLASS =
  "w-full max-h-[70%] flex-col gap-2 rounded-xl bg-background p-4";
