/**
 * The platform content blocks.
 *
 * Each block is the framework component plus the shared spec: the label, the fields and
 * the defaults come from `src/shared`, and only the drawing is written here. What the
 * platform draws differently is stated in the block: a paragraph's alignment is a
 * property of its `Text` rather than a class on a paragraph element, so the shared
 * alignment vocabulary is what reaches the component.
 */

import { SECTION_BLOCK_TEXT_ALIGN } from "@asheeui/core";
import { Container, Section, Text } from "@asheeui/native";
import { SectionHeading } from "@asheeui/native/section-kit";
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
    <Section spacing="md">
      <Container>
        <SectionHeading
          eyebrow={eyebrow || undefined}
          title={title || undefined}
          description={description || undefined}
          align={align ?? "start"}
          size="lg"
        />
      </Container>
    </Section>
  ),
};

/**
 * A paragraph of body text.
 */
export const textBlock: AsheeBlock<TextBlockProps> = {
  ...TEXT_SPEC,
  render: ({ text, align }) => (
    <Section spacing="sm">
      <Container>
        <Text role="body-lg" align={SECTION_BLOCK_TEXT_ALIGN[align ?? "start"]}>
          {text}
        </Text>
      </Container>
    </Section>
  ),
};
