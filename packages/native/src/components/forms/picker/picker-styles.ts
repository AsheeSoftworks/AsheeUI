/**
 * The class dictionaries the native picker list is built from.
 *
 * They are internal to this package rather than part of the design language, because the
 * list is a native answer to a native problem: a web select floats its options beside the
 * trigger, where the platform has one surface at a time. What the list shows is still the
 * framework's — the field family's colours and densities — so the classes read the theme.
 *
 * The frame the list is drawn on is not here: a select opens one, and so does a date field,
 * so the surface owns its own classes and every field that opens one reads them.
 */

/** The list, which scrolls when there are more options than fit. */
export const NATIVE_PICKER_LIST_CLASS = "w-full";

/** One option, which is a whole row so a thumb can hit it. */
export const NATIVE_PICKER_OPTION_CLASS =
  "flex-row items-center justify-between gap-3 rounded-md px-3 py-3";

/** The option the reader has picked. */
export const NATIVE_PICKER_OPTION_SELECTED_CLASS = "bg-primary/10";

/** The option that is unavailable. */
export const NATIVE_PICKER_OPTION_DISABLED_CLASS = "opacity-50";

/** The option's label. */
export const NATIVE_PICKER_OPTION_LABEL_CLASS = "text-base text-foreground";

/** The option's supporting text. */
export const NATIVE_PICKER_OPTION_DESCRIPTION_CLASS =
  "text-sm text-foreground/60";

/** The mark that says which option is picked. */
export const NATIVE_PICKER_CHECK_CLASS = "text-primary";

/** What the surface says when there is nothing to pick from. */
export const NATIVE_PICKER_EMPTY_CLASS = "text-sm text-foreground/60";

/** The row that holds the field's own trigger, which the picker opens from. */
export const NATIVE_PICKER_TRIGGER_CLASS =
  "flex-row items-center justify-between gap-2";

// ─── Autocomplete's list, which is not a surface ───────────────────────────────

/**
 * The suggestions an autocomplete shows.
 *
 * They sit in the layout under the field rather than on a surface, because an autocomplete
 * is read while the reader types: a value the reader cannot see the field and the
 * suggestions in at once is a value they cannot compare.
 */
export const NATIVE_SUGGESTION_LIST_CLASS =
  "flex-col gap-1 rounded-md border border-border bg-background p-2";

/** One suggestion. */
export const NATIVE_SUGGESTION_CLASS = "rounded-md px-3 py-2";

/** What the list says when nothing matches. */
export const NATIVE_SUGGESTION_EMPTY_CLASS = "text-sm text-foreground/60";

// ─── MultiSelect's chips ──────────────────────────────────────────────────────

/** The row the picked values sit in, inside the trigger. */
export const NATIVE_CHIP_ROW_CLASS =
  "flex-row flex-wrap items-center gap-1.5 flex-1 min-w-0";

/** One picked value. */
export const NATIVE_CHIP_CLASS =
  "flex-row items-center gap-1 rounded bg-primary/10 px-2 py-0.5";

/** Its label. */
export const NATIVE_CHIP_LABEL_CLASS = "text-sm text-foreground";

/** The control that removes it. */
export const NATIVE_CHIP_REMOVE_CLASS = "px-1 text-sm text-foreground/60";
