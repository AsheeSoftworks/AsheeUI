/**
 * Content blocks for Puck.
 *
 * These are the blocks that place words on a page: a section heading and a
 * paragraph, both rendered through the framework's `Typography` so a builder
 * cannot introduce text that breaks the typography scale.
 */

import type { ComponentConfig } from "@puckeditor/core";
import { Section } from "../../components/section";
import { SectionHeading } from "../../components/section-kit/SectionHeading";
import { Typography } from "../../components/typography/Typography";
import {
  ALIGNMENT_OPTIONS,
  selectField,
  textareaField,
  textField,
} from "../fields";

/**
 * Configuration of the heading block.
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
export const headingBlock: ComponentConfig<HeadingBlockProps> = {
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
  render: ({ eyebrow, title, description, align }) => (
    <Section spacing="md" contained>
      <SectionHeading
        eyebrow={eyebrow || undefined}
        title={title || undefined}
        description={description || undefined}
        align={align ?? "start"}
        size="lg"
      />
    </Section>
  ),
};

/**
 * Configuration of the text block.
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
export const textBlock: ComponentConfig<TextBlockProps> = {
  label: "Text",
  fields: {
    text: textareaField("Text", "Write the paragraph here."),
    align: selectField("Alignment", ALIGNMENT_OPTIONS),
  },
  defaultProps: {
    text: "Write the paragraph here.",
    align: "start",
  },
  render: ({ text, align }) => (
    <Section spacing="sm" contained>
      <Typography
        role="body-lg"
        className={
          align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"
        }>
        {text}
      </Typography>
    </Section>
  ),
};
