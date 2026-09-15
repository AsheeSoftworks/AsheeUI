/**
 * Hero component styles for AsheeUI.
 * This file provides the static class mappings for the Hero pattern: the
 * two-column arrangement used when the hero has media, and the measure of the
 * text column.
 */

/** The grid that places the text column and the media beside each other. */
export const HERO_LAYOUT_CLASS = "grid items-center gap-10 lg:grid-cols-2";

/** The text column. */
export const HERO_TEXT_COLUMN_CLASS = "flex min-w-0 flex-col gap-6";

/** Puts the media column first from the `lg` breakpoint upwards. */
export const HERO_MEDIA_FIRST_CLASS = "lg:order-first";

/** The media column. */
export const HERO_MEDIA_CLASS = "min-w-0";

/** Added to the text column when the hero is centred. */
export const HERO_CENTERED_CLASS = "items-center text-center";

/** Measure of the description when the hero stands alone. */
export const HERO_DESCRIPTION_MEASURE_CLASS = "max-w-2xl";
