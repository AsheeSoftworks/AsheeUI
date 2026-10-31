/**
 * The platform's class dictionaries for table.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/data-display/table/table-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { Color, TableVariant, Variant } from "@asheeui/core";

/**
 * The native list of rows.
 *
 * The web draws one element per cell in a grid; the platform draws a surface per row,
 * because a table is not a reading pattern a thumb can follow. The list is a column of those
 * surfaces with the framework's own gap between them.
 */
export const NATIVE_ROW_LIST_CLASS = "w-full flex flex-col gap-3";

/** One native row's own arrangement: its labelled lines, in order. */
export const NATIVE_ROW_LIST_ROW_CLASS = "w-full flex flex-col gap-2";

/** One labelled line: the column's header beside the cell it names. */
export const NATIVE_ROW_LIST_FIELD_CLASS =
  "flex flex-row items-start justify-between gap-3";

/**
 * The cell side of a labelled line, which takes the room the label leaves.
 * The row states the separation, so a long value wraps rather than overflowing.
 */
export const NATIVE_ROW_LIST_VALUE_CLASS = "flex flex-1 flex-col items-end";

/**
 * The accent a chosen native row carries, per colour role.
 *
 * The platform's card states its accent as a border colour, and its own border already
 * carries the theme's muted accent, so a chosen row states the accent fully rather than at
 * the card's default weight — which is what makes the chosen row visibly chosen. The class
 * is applied last, so it is what the row's border resolves to.
 */
export const NATIVE_ROW_LIST_SELECTED_CLASS: Record<Color, string> = {
  none: "border-foreground/60",
  primary: "border-primary",
  secondary: "border-secondary",
  danger: "border-danger",
  warning: "border-warning",
  success: "border-success",
};

/**
 * The surface each native row is drawn on, per variant.
 *
 * The web's variants describe how cells are separated from each other — grid lines, bands,
 * an outer border, or nothing. The platform draws each row as its own surface, so the
 * variants resolve to the surface treatment each one asks for: a defined surface for the two
 * that separate cells with an edge, the framework's tinted surface for the striped variant
 * (each row is already separated, so the tint is what the band becomes), and no surface at
 * all for the ghost variant. `none` is not reachable: every variant here is a surface a row
 * can be drawn on.
 */
export const NATIVE_ROW_LIST_SURFACE: Record<TableVariant, Variant> = {
  grid: "bordered",
  striped: "faded",
  bordered: "bordered",
  ghost: "ghost",
};
