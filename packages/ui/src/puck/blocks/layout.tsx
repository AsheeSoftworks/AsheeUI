/**
 * Layout blocks for Puck.
 *
 * These blocks expose the framework's layout components to a visual builder: a
 * band with its own rhythm and background, and a two-column arrangement. Each
 * block names its drop zones, so the builder shows the page in the same
 * structure the published page has.
 */

import type { ComponentConfig, SlotComponent } from "@puckeditor/core";
import { Section } from "../../components/section";
import type { SectionBackground } from "../../components/section/section-config";
import type { Space } from "../../shared";
import { cn } from "../../utils";
import { BACKGROUND_OPTIONS, SPACING_OPTIONS, selectField } from "../fields";

/**
 * Ratio options a two-column block offers.
 */
export const COLUMN_RATIO_OPTIONS = ["50/50", "33/67", "67/33"] as const;

/**
 * Ratio of a two-column arrangement, from the `lg` breakpoint upwards.
 */
export type ColumnRatio = (typeof COLUMN_RATIO_OPTIONS)[number];

/**
 * The grid columns each ratio resolves to.
 * The strings are complete literals, so Tailwind emits them.
 */
const COLUMN_RATIO_CLASS: Record<ColumnRatio, string> = {
  "50/50": "lg:grid-cols-2",
  "33/67": "lg:grid-cols-[1fr_2fr]",
  "67/33": "lg:grid-cols-[2fr_1fr]",
};

/**
 * Configuration of the band block.
 */
export type SectionBlockProps = {
  /** Vertical padding of the band. */
  spacing?: Space;

  /** Background treatment of the band. */
  background?: SectionBackground;

  /** Content dropped into the band. */
  content?: SlotComponent;
};

/**
 * A band with its own vertical rhythm and background.
 */
export const sectionBlock: ComponentConfig<SectionBlockProps> = {
  label: "Section",
  fields: {
    spacing: selectField("Vertical spacing", SPACING_OPTIONS),
    background: selectField("Background", BACKGROUND_OPTIONS),
    content: { type: "slot", label: "Content" },
  },
  defaultProps: { spacing: "lg", background: "none" },
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
 * Configuration of the two-column block.
 */
export type ColumnsBlockProps = {
  /** Ratio of the two columns from the `lg` breakpoint upwards. */
  ratio?: ColumnRatio;

  /** Vertical padding of the band the columns sit in. */
  spacing?: Space;

  /** Content of the first column. */
  start?: SlotComponent;

  /** Content of the second column. */
  end?: SlotComponent;
};

/**
 * Two columns that stack on a narrow screen.
 */
export const columnsBlock: ComponentConfig<ColumnsBlockProps> = {
  label: "Columns",
  fields: {
    ratio: selectField("Column ratio", COLUMN_RATIO_OPTIONS),
    spacing: selectField("Vertical spacing", SPACING_OPTIONS),
    start: { type: "slot", label: "First column" },
    end: { type: "slot", label: "Second column" },
  },
  defaultProps: { ratio: "50/50", spacing: "lg" },
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
