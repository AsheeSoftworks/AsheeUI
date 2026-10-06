/**
 * The Hero's class dictionaries, for both renderers.
 *
 * The arrangement is the whole component, so it is what is stated here: the web places the
 * text column and the media beside each other on a wide window with a two-column grid and
 * moves the media across with an order class; the platform has no column count and no order,
 * so it lays the two out in a row when the window is wide and in a column otherwise, and
 * orders them by where they sit in the tree. Both keep the same rhythm and the same measure
 * for a description that has no media beside it.
 *
 * Every entry is a complete, static class string. An unprefixed `HERO_*` constant is the web
 * renderer's; `NATIVE_HERO_*` is the native renderer's.
 */

/** The grid that places the text column and the media beside each other, on the web. */
export const HERO_LAYOUT_CLASS = "grid items-center gap-10 lg:grid-cols-2";

/** The text column, on the web. */
export const HERO_TEXT_COLUMN_CLASS = "flex min-w-0 flex-col gap-6";

/** Puts the media column first from the `lg` breakpoint upwards, on the web. */
export const HERO_MEDIA_FIRST_CLASS = "lg:order-first";

/** The media column, on the web. */
export const HERO_MEDIA_CLASS = "min-w-0";

/** Added to the text column when the hero is centred, on the web. */
export const HERO_CENTERED_CLASS = "items-center text-center";

/** Measure of the description when the hero stands alone, on the web. */
export const HERO_DESCRIPTION_MEASURE_CLASS = "max-w-2xl";

// ─── Native ───────────────────────────────────────────────────────────────────

/** The band itself, on the platform. */
export const NATIVE_HERO_BASE_CLASS = "w-full";

/**
 * The arrangement of a hero that has media, on the platform.
 *
 * The platform states one arrangement and the component picks it from the window it measures
 * rather than from a class variant: a phone stacks the media under the text, and a window
 * with room for two columns puts them beside each other. A hero without media uses neither.
 */
export const NATIVE_HERO_ROW_CLASS = "flex-row items-center gap-8";

/** The stacked arrangement of a hero that has media, on the platform. */
export const NATIVE_HERO_COLUMN_CLASS = "flex-col gap-6";

/** The text column, on the platform. */
export const NATIVE_HERO_TEXT_COLUMN_CLASS = "flex-1 w-full gap-4";

/** The media column, on the platform. */
export const NATIVE_HERO_MEDIA_CLASS = "flex-1 w-full";
