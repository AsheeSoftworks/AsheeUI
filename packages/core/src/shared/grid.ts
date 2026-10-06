/**
 * The grid vocabulary the framework's layouts share.
 *
 * A column count is a design-language decision rather than a renderer's: a band that lays
 * its features out in three columns is asking the same question on the web and on a tablet.
 * The counts are declared here so a pattern can state them wherever it is written, and so
 * `Grid` on either platform reads one list rather than two.
 *
 * The list is deliberately short. It holds the counts the framework's own layouts use, so
 * every count has a complete class literal behind it rather than an assembled one
 * (Hard Rule 5).
 */

/**
 * Column counts a grid can declare.
 * Only the counts the framework's own layouts use are offered, so the class map stays
 * small and every entry is a complete literal.
 */
export type GridColumns = 1 | 2 | 3 | 4 | 6 | 12;

/**
 * Cross-axis alignment of a grid's items.
 * `stretch` makes every cell fill the row height, which is what a row of cards wants.
 */
export type GridAlign = "start" | "center" | "end" | "stretch";
