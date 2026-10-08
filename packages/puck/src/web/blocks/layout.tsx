"use client";

/**
 * The web layout blocks.
 *
 * A band and a two-column arrangement. Both are the only blocks whose props hold a
 * drop zone, so both are written against the builder's own `SlotComponent`: the
 * editor drops a component into the field and the block places it. The fields and the
 * defaults still come from `src/shared`, so the platform offers the same two zones.
 */

import { cn } from "@asheeui/core";
import { Section } from "@asheeui/web";
import type { SlotComponent } from "@puckeditor/core";
import type {
  AsheeBlock,
  ColumnsBandProps,
  SectionBandProps,
} from "../../shared";
import { COLUMN_RATIO_CLASS, COLUMNS_SPEC, SECTION_SPEC } from "../../shared";

/**
 * The props of the band block.
 */
export type SectionBlockProps = SectionBandProps & {
  /** Content dropped into the band. */
  content?: SlotComponent;
};

/**
 * A band with its own vertical rhythm and background.
 */
export const sectionBlock: AsheeBlock<SectionBlockProps> = {
  ...SECTION_SPEC,
  render: ({ spacing, background, content: Content }) => (
    <Section
      spacing={spacing ?? "lg"}
      background={background ?? "none"}
      contained>
      {Content ? <Content /> : null}
    </Section>
  ),
};

/**
 * The props of the two-column block.
 */
export type ColumnsBlockProps = ColumnsBandProps & {
  /** Content of the first column. */
  start?: SlotComponent;

  /** Content of the second column. */
  end?: SlotComponent;
};

/**
 * Two columns that stack on a narrow screen.
 */
export const columnsBlock: AsheeBlock<ColumnsBlockProps> = {
  ...COLUMNS_SPEC,
  render: ({ ratio, spacing, start: Start, end: End }) => (
    <Section spacing={spacing ?? "lg"} contained>
      <div
        className={cn(
          "grid grid-cols-1 gap-8",
          COLUMN_RATIO_CLASS[ratio ?? "50/50"],
        )}>
        <div className="min-w-0">{Start ? <Start /> : null}</div>
        <div className="min-w-0">{End ? <End /> : null}</div>
      </div>
    </Section>
  ),
};
