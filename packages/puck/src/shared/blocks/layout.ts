/**
 * The layout blocks, stated once for both renderers.
 *
 * A band with its own rhythm and background, and a two-column arrangement. These are
 * the two blocks that hold other blocks, and they are also the two whose *props* differ
 * between the platforms while their *fields* do not: the web hands a render function a
 * drop-zone component to place, the platform hands it rendered children. So the fields
 * and the defaults are stated here, once, and the prop type each renderer receives is
 * declared beside it — which keeps a builder from offering two different drop zones for
 * one block.
 */

import type { SectionBackground, Space } from "@asheeui/core";
import { BACKGROUND_OPTIONS, SPACING_OPTIONS, selectField } from "../fields";
import type { AsheeBlockSpec } from "../types";

/**
 * Ratio options a two-column block offers.
 */
export const COLUMN_RATIO_OPTIONS = ["50/50", "33/67", "67/33"] as const;

/**
 * Ratio of a two-column arrangement, from the `lg` breakpoint upwards.
 */
export type ColumnRatio = (typeof COLUMN_RATIO_OPTIONS)[number];

/**
 * The band options a section-level block carries, which is every part of its value that
 * is not a drop zone.
 */
export type SectionBandProps = {
  /** Vertical padding of the band. */
  spacing?: Space;

  /** Background treatment of the band. */
  background?: SectionBackground;
};

/**
 * A band with its own vertical rhythm and background.
 */
export const SECTION_SPEC: AsheeBlockSpec<SectionBandProps> = {
  label: "Section",
  fields: {
    spacing: selectField("Vertical spacing", SPACING_OPTIONS),
    background: selectField("Background", BACKGROUND_OPTIONS),
    content: { type: "slot", label: "Content" },
  },
  defaultProps: { spacing: "lg", background: "none" },
};

/**
 * Everything of the two-column block that is not a drop zone.
 */
export type ColumnsBandProps = SectionBandProps & {
  /** Ratio of the two columns from the `lg` breakpoint upwards. */
  ratio?: ColumnRatio;
};

/**
 * Two columns that stack on a narrow screen.
 */
export const COLUMNS_SPEC: AsheeBlockSpec<ColumnsBandProps> = {
  label: "Columns",
  fields: {
    ratio: selectField("Column ratio", COLUMN_RATIO_OPTIONS),
    spacing: selectField("Vertical spacing", SPACING_OPTIONS),
    start: { type: "slot", label: "First column" },
    end: { type: "slot", label: "Second column" },
  },
  defaultProps: { ratio: "50/50", spacing: "lg" },
};

/**
 * The grid columns each ratio resolves to, on the web.
 * The strings are complete literals, so Tailwind emits them.
 */
export const COLUMN_RATIO_CLASS: Record<ColumnRatio, string> = {
  "50/50": "lg:grid-cols-2",
  "33/67": "lg:grid-cols-[1fr_2fr]",
  "67/33": "lg:grid-cols-[2fr_1fr]",
};
