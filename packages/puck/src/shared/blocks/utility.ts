/**
 * The utility blocks, stated once for both renderers.
 *
 * The empty state is the one utility block a marketing or application page needs from
 * a builder: a region that has nothing in it yet, which a non-developer can word and
 * justify without touching code. Its fields are stated here so the two platforms offer
 * the same editor for it.
 */

import type { EmptyStateType } from "@asheeui/core";
import type { BuilderAction } from "../adapters";
import {
  ACTION_FIELDS,
  selectField,
  textareaField,
  textField,
} from "../fields";
import type { AsheeBlockSpec } from "../types";

/**
 * The props of the empty state block.
 */
export type EmptyStateBlockProps = {
  /** What the region is. */
  title?: string;

  /** What the reader can do about it. */
  description?: string;

  /** Tone of the state. */
  type?: EmptyStateType;

  /** Whether the state is drawn as a panel. */
  panel?: boolean;

  /** The emphasised action. */
  primaryAction?: BuilderAction;
};

/**
 * A region with nothing in it.
 */
export const EMPTY_STATE_SPEC: AsheeBlockSpec<EmptyStateBlockProps> = {
  label: "Empty state",
  fields: {
    title: textField("Heading", "Nothing here yet"),
    description: textareaField("Description"),
    type: selectField("Tone", ["info", "success", "warning", "error"] as const),
    panel: {
      type: "radio",
      label: "Panel",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    primaryAction: ACTION_FIELDS,
  },
  defaultProps: {
    title: "Nothing here yet",
    description: "Create the first item to see it here.",
    type: "info",
    panel: true,
  },
};
