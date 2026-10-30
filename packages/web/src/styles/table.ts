/**
 * The web renderer's class dictionaries for table.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/components/data-display/table/table-styles.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type { Size } from "@asheeui/core";

/**
 * CSS classes for table cell vertical padding.
 * Maps size keys to Tailwind padding-y classes.
 */
export const TABLE_CELL_PADDING_Y_CLASS: Record<Size, string> = {
  sm: "py-1.5",
  md: "py-2.5",
  lg: "py-3.5",
};

/**
 * CSS classes for table cell horizontal padding.
 * Maps size keys to Tailwind padding-x classes.
 */
export const TABLE_CELL_PADDING_X_CLASS: Record<Size, string> = {
  sm: "px-2",
  md: "px-3",
  lg: "px-4",
};

/**
 * CSS classes for table body font size.
 * Maps size keys to Tailwind text size classes.
 */
export const TABLE_FONT_CLASS: Record<Size, string> = {
  sm: "text-[0.8125rem]",
  md: "text-sm",
  lg: "text-base",
};

/**
 * CSS classes for table header font size.
 * Maps size keys to Tailwind text size classes.
 */
export const TABLE_HEADER_FONT_CLASS: Record<Size, string> = {
  sm: "text-xs",
  md: "text-[0.8125rem]",
  lg: "text-sm",
};
