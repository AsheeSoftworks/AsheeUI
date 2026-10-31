/**
 * The platform's class dictionaries for file-upload.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/components/forms/file-upload/file-upload-styles.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { Size } from "@asheeui/core";

/**
 * The zone, which is the control.
 * It is dashed and rounded like the web's, because the shape is what says "something goes
 * here" on both platforms.
 */
export const NATIVE_FILE_UPLOAD_ZONE_CLASS =
  "w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-background";

/** The zone when the field is unavailable. */
export const NATIVE_FILE_UPLOAD_ZONE_DISABLED_CLASS = "opacity-60";

/** Padding for each density, one step above the web's so the zone is thumb-reachable. */
export const NATIVE_FILE_UPLOAD_SIZE_CLASS: Record<Size, string> = {
  sm: "px-4 py-8",
  md: "px-6 py-12",
  lg: "px-8 py-16",
};

/** The control's label, which is a pressable row rather than an emphasised word. */
export const NATIVE_FILE_UPLOAD_BUTTON_CLASS = "font-medium text-primary";

/** The instruction under it. */
export const NATIVE_FILE_UPLOAD_HINT_CLASS = "text-sm text-foreground/60";

/** The list of chosen files, which is a column of rows a reader can act on. */
export const NATIVE_FILE_UPLOAD_LIST_CLASS = "w-full flex-col gap-2 pt-2";

/** One chosen file. */
export const NATIVE_FILE_UPLOAD_FILE_CLASS =
  "flex-row items-center justify-between gap-2 rounded-md border border-border px-3 py-2";

/** Its name and its size. */
export const NATIVE_FILE_UPLOAD_FILE_NAME_CLASS = "text-sm text-foreground";

export const NATIVE_FILE_UPLOAD_FILE_SIZE_CLASS = "text-sm text-foreground/60";

/** The control that removes a chosen file. */
export const NATIVE_FILE_UPLOAD_REMOVE_CLASS = "px-2 py-1 text-foreground/60";
