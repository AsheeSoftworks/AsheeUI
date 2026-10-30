/**
 * The web renderer's class dictionaries for section-block.
 *
 * They were declared in `@asheeui/core`, beside the platform's own strings, in
 * `packages/core/src/shared/section-block.ts`. A class string states a decision about pixels, and the two
 * platforms' pixels differ: Tailwind compiles what it can read from this package, and core — the
 * shared contract — must not hold a string only one renderer compiles. No name and no value
 * changed: every constant is the one core published, character for character.
 */

import type {
  SectionBlockAlign,
  SectionBlockHeadingElement,
  SectionBlockHeadingSize,
} from "@asheeui/core";

/**
 * The heading block, on the web: an eyebrow, a title and a supporting sentence.
 * The alignment is added from the map below rather than stated here, because it is the one
 * part of the block that changes with the band's own choice.
 */
export const SECTION_BLOCK_HEADING_CLASS = "flex flex-col gap-2";

/** Alignment of the heading block, on the web. */
export const SECTION_BLOCK_HEADING_ALIGN_CLASS: Record<
  SectionBlockAlign,
  string
> = {
  start: "",
  center: "items-center text-center",
};

/**
 * Measure of the supporting sentence, on the web.
 * A sentence reads badly past a certain width, so the block states one.
 */
export const SECTION_BLOCK_DESCRIPTION_CLASS = "max-w-2xl";

/** The measure a centred supporting sentence keeps, on the web. */
export const SECTION_BLOCK_DESCRIPTION_CENTERED_CLASS = "mx-auto";

/**
 * The row that holds a band's configured actions, on the web.
 * It stacks on a narrow screen and sits in a row from the `sm` breakpoint, which is the
 * arrangement that keeps two actions readable on a phone without a media query.
 */
export const SECTION_BLOCK_ACTIONS_CLASS =
  "flex flex-col gap-3 sm:flex-row sm:items-center";

/** Alignment of the action row, on the web. */
export const SECTION_BLOCK_ACTIONS_ALIGN_CLASS: Record<
  SectionBlockAlign,
  string
> = {
  start: "",
  center: "sm:justify-center",
};

/**
 * The element a band's heading renders as when the band names no element.
 *
 * A band is a *section* of a page, not the page's own title, so every size renders an `h2`:
 * a hero, a call to action, a feature grid and a testimonial wall can then sit on one page
 * without producing a heading per band at level one. Raising the level is the caller's
 * decision — `titleAs` on the heading — and it is the only way a band becomes the document's
 * `h1`; lowering it, for a band nested under an existing section, is the same prop.
 *
 * This is deliberately a map rather than a single constant: if a size ever needs a different
 * default the size is the thing that changes, and every renderer reads the change from here.
 */
export const SECTION_BLOCK_HEADING_ELEMENT: Record<
  SectionBlockHeadingSize,
  SectionBlockHeadingElement
> = {
  md: "h2",
  lg: "h2",
  xl: "h2",
};
