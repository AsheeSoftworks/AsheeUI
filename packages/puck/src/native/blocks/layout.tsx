/**
 * The platform layout blocks.
 *
 * A band and a two-column arrangement. Both are the only blocks whose props hold a drop
 * zone, and on the platform a drop zone is a rendered node rather than a component to
 * place: the page renderer resolves a stored page's children before it calls a block, so
 * the block receives what to draw. That is why these two props are declared here while
 * every other block's come from the shared spec.
 *
 * One difference between the platforms is deliberate and stated rather than hidden. A
 * two-column block offers a ratio on the web, where a stylesheet expresses one; the
 * platform's grid resolves its own window and offers whole column counts, so the ratio
 * resolves to the framework's two columns once there is room for them and the block
 * draws the same arrangement at every width below that.
 */

import { Container, Grid, Section } from "@asheeui/native";
import type { ReactNode } from "react";
import type {
  AsheeBlock,
  ColumnsBandProps,
  SectionBandProps,
} from "../../shared";
import { COLUMNS_SPEC, SECTION_SPEC } from "../../shared";

/**
 * The props of the band block.
 */
export type SectionBlockProps = SectionBandProps & {
  /** Content dropped into the band, already rendered. */
  content?: ReactNode;
};

/**
 * A band with its own vertical rhythm and background.
 */
export const sectionBlock: AsheeBlock<SectionBlockProps> = {
  ...SECTION_SPEC,
  render: ({ spacing, background, content }) => (
    <Section spacing={spacing ?? "lg"} background={background ?? "none"}>
      <Container>{content}</Container>
    </Section>
  ),
};

/**
 * The props of the two-column block.
 */
export type ColumnsBlockProps = ColumnsBandProps & {
  /** Content of the first column, already rendered. */
  start?: ReactNode;

  /** Content of the second column, already rendered. */
  end?: ReactNode;
};

/**
 * Two columns that stack on a narrow screen.
 */
export const columnsBlock: AsheeBlock<ColumnsBlockProps> = {
  ...COLUMNS_SPEC,
  render: ({ spacing, start, end }) => (
    <Section spacing={spacing ?? "lg"}>
      <Container>
        <Grid columns={1} columnsLg={2} gap="lg">
          {start}
          {end}
        </Grid>
      </Container>
    </Section>
  ),
};
