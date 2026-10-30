/**
 * The platform's class dictionaries for section-block.
 *
 * They were declared in `@asheeui/core`, beside the web renderer's own strings, in
 * `packages/core/src/shared/section-block.ts`.
 *
 * A class string states a decision about pixels, and the two platforms' pixels differ: NativeWind
 * compiles what it can read from this package, and core — the shared contract — must not hold a
 * string only one renderer compiles. No name and no value changed: every constant is the one core
 * published, character for character.
 */

import type { SectionBlockAlign } from "@asheeui/core";

/** The heading block, on the platform. */
export const NATIVE_SECTION_BLOCK_HEADING_CLASS = "w-full flex-col gap-1";

/** Alignment of the heading block, on the platform. */
export const NATIVE_SECTION_BLOCK_HEADING_ALIGN_CLASS: Record<
  SectionBlockAlign,
  string
> = {
  start: "items-start",
  center: "items-center",
};

/**
 * The row that holds a band's configured actions, on the platform.
 * The platform has one width, so the row is a wrapping row rather than a column that becomes
 * a row at a breakpoint: two actions wrap onto a second line when their labels need the
 * room, which is what a thumb reads best.
 */
export const NATIVE_SECTION_BLOCK_ACTIONS_CLASS =
  "flex-row flex-wrap items-center gap-2";

/** Alignment of the action row, on the platform. */
export const NATIVE_SECTION_BLOCK_ACTIONS_ALIGN_CLASS: Record<
  SectionBlockAlign,
  string
> = {
  start: "justify-start",
  center: "justify-center",
};
