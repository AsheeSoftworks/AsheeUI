/**
 * The content blocks, stated once for both renderers.
 *
 * These are the blocks that place words on a page: a section heading and a paragraph.
 * What is stated here is everything but the drawing — the label a builder shows, the
 * fields it fills in and the value each starts as — because the drawing is the one part
 * that is the platform's: the web composes a `Section` and a `Typography`, the platform
 * composes its own two. Everything else would otherwise be stated twice and could
 * drift.
 */

import {
  ALIGNMENT_OPTIONS,
  selectField,
  textareaField,
  textField,
} from "../fields";
import type { AsheeBlockSpec } from "../types";

/**
 * The props of the heading block.
 */
export type HeadingBlockProps = {
  /** Short label above the heading. */
  eyebrow?: string;

  /** The heading itself. */
  title?: string;

  /** Supporting sentence under the heading. */
  description?: string;

  /** Horizontal alignment of the block. */
  align?: "start" | "center";
};

/**
 * A section heading with an optional eyebrow and description.
 */
export const HEADING_SPEC: AsheeBlockSpec<HeadingBlockProps> = {
  label: "Heading",
  fields: {
    eyebrow: textField("Eyebrow", "Why teams switch"),
    title: textField("Heading", "Everything in one place"),
    description: textareaField("Description"),
    align: selectField("Alignment", ALIGNMENT_OPTIONS),
  },
  defaultProps: {
    eyebrow: "",
    title: "Everything in one place",
    description: "",
    align: "start",
  },
};

/**
 * The props of the text block.
 */
export type TextBlockProps = {
  /** The paragraph. */
  text?: string;

  /** Alignment of the paragraph. */
  align?: "start" | "center";
};

/**
 * A paragraph of body text.
 */
export const TEXT_SPEC: AsheeBlockSpec<TextBlockProps> = {
  label: "Text",
  fields: {
    text: textareaField("Text", "Write the paragraph here."),
    align: selectField("Alignment", ALIGNMENT_OPTIONS),
  },
  defaultProps: {
    text: "Write the paragraph here.",
    align: "start",
  },
};
