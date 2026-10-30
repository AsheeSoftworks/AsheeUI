/**
 * The platform's class dictionaries for drawer.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/overlays/drawer/drawer-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { DrawerPlacement, DrawerSize } from "@asheeui/core";

/**
 * The edge a native drawer's sheet comes from, per placement.
 *
 * A web drawer is a panel at the side of the page. A panel at the side of a phone has nowhere
 * to be, so the platform's placement resolves a side to the sheet it uses for this instead,
 * and keeps a top or bottom placement as the edge the sheet comes from.
 */
export const NATIVE_DRAWER_SHEET_EDGE: Record<
  DrawerPlacement,
  "top" | "bottom"
> = {
  right: "bottom",
  left: "bottom",
  bottom: "bottom",
  top: "top",
};

/** Where the sheet sits, per edge. */
export const NATIVE_DRAWER_EDGE_CLASS: Record<"top" | "bottom", string> = {
  top: "justify-start",
  bottom: "justify-end",
};

/** The edge the sheet is outlined on, per edge. */
export const NATIVE_DRAWER_BORDER_CLASS: Record<"top" | "bottom", string> = {
  top: "border-b border-border",
  bottom: "border-t border-border",
};

/**
 * How much of the screen the sheet takes.
 * Every size is a height on the platform, because the sheet is measured from the edge it comes
 * from rather than from a side of the page.
 */
export const NATIVE_DRAWER_SIZE_CLASS: Record<DrawerSize, string> = {
  sm: "h-1/3",
  md: "h-1/2",
  lg: "h-2/3",
  full: "h-full",
};

/** The layer behind the sheet, which dims the screen and can dismiss it. */
export const NATIVE_DRAWER_BACKDROP_CLASS = "flex-1 bg-foreground/30";

/** The sheet itself. */
export const NATIVE_DRAWER_SHEET_CLASS = "w-full bg-background p-4 gap-3";
