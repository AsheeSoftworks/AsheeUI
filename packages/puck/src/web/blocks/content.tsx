"use client";

/**
 * The web content blocks.
 *
 * Each block is the framework component plus the shared spec: the label, the fields and
 * the defaults come from `src/shared`, and only the drawing is written here. That is
 * what keeps the editor's promise — a block cannot describe one thing and render
 * another — while letting each platform draw with its own components.
 */

import { Section, Typography } from "@asheeui/web";
import { SectionHeading } from "@asheeui/web/section-kit";
import type {
  AsheeBlock,
  HeadingBlockProps,
  TextBlockProps,
} from "../../shared";
import { HEADING_SPEC, TEXT_SPEC } from "../../shared";

/**
 * A section heading with an optional eyebrow and description.
 */
export const headingBlock: AsheeBlock<HeadingBlockProps> = {
  ...HEADING_SPEC,
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
 * A paragraph of body text.
 */
export const textBlock: AsheeBlock<TextBlockProps> = {
  ...TEXT_SPEC,
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
