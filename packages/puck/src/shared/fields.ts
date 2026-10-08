/**
 * Reusable field definitions for the AsheeUI blocks.
 *
 * These builders are the boundary between a component's visual configuration and its
 * React implementation: every option a block exposes is described here as a
 * serializable field, so the value a consumer edits in the builder is a plain string,
 * number or array that survives a save and a reload. Nothing in this file imports a
 * component, and nothing it produces is a function, which is what lets the same
 * definitions describe a block to the web editor and to the native renderer.
 *
 * The types come from `./types`, this package's own, rather than from the editor: the
 * native entry has to load without a DOM editor, and a field is data either way.
 */

import type {
  AsheeArrayField,
  AsheeObjectField,
  AsheeSelectField,
  AsheeTextareaField,
  AsheeTextField,
} from "./types";

/**
 * Build a select field from the values a prop accepts.
 *
 * The options are derived from the same tuple the component's type uses, so a value
 * the builder offers and a value the component accepts cannot drift.
 *
 * @param label - Label shown in the builder.
 * @param options - The accepted values.
 * @returns The field definition.
 */
export function selectField<T extends string>(
  label: string,
  options: readonly T[],
): AsheeSelectField {
  return {
    type: "select",
    label,
    options: options.map((value) => ({ label: value, value })),
  };
}

/**
 * Build a single-line text field.
 *
 * @param label - Label shown in the builder.
 * @param placeholder - Placeholder shown in the empty field.
 * @returns The field definition.
 */
export function textField(label: string, placeholder?: string): AsheeTextField {
  return { type: "text", label, placeholder };
}

/**
 * Build a multi-line text field.
 *
 * @param label - Label shown in the builder.
 * @param placeholder - Placeholder shown in the empty field.
 * @returns The field definition.
 */
export function textareaField(
  label: string,
  placeholder?: string,
): AsheeTextareaField {
  return { type: "textarea", label, placeholder };
}

/**
 * Alignment options shared by the patterns that can centre their content.
 */
export const ALIGNMENT_OPTIONS = ["start", "center"] as const;

/**
 * Vertical rhythm options shared by the section-level blocks.
 */
export const SPACING_OPTIONS = [
  "none",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
] as const;

/**
 * Background treatments a section-level block can offer.
 */
export const BACKGROUND_OPTIONS = ["none", "muted", "tinted"] as const;

/**
 * Maximum content widths a block can offer.
 */
export const CONTAINER_SIZE_OPTIONS = ["sm", "md", "lg", "xl", "full"] as const;

/**
 * Column counts a grid block can offer.
 */
export const COLUMNS_OPTIONS = ["1", "2", "3", "4"] as const;

/**
 * Button variants a configured action can offer.
 */
export const ACTION_VARIANT_OPTIONS = [
  "solid",
  "faded",
  "bordered",
  "ghost",
] as const;

/**
 * Fields of a configured action.
 *
 * The shape matches the framework's `ActionConfig` for the fields a builder can own:
 * wording, destination and emphasis. An icon, a custom component and a click handler
 * stay out, because none of them can be serialized.
 */
export const ACTION_FIELDS: AsheeObjectField = {
  type: "object",
  label: "Action",
  objectFields: {
    label: textField("Action label"),
    href: textField("Action link", "/pricing"),
    variant: selectField("Action emphasis", ACTION_VARIANT_OPTIONS),
  },
};

/**
 * A single feature inside a feature grid.
 */
export const FEATURE_ITEM_FIELD: AsheeArrayField<{
  title: string;
  description: string;
}> = {
  type: "array",
  label: "Features",
  arrayFields: {
    title: textField("Feature title"),
    description: textareaField("Feature description"),
  },
  defaultItemProps: { title: "New feature", description: "" },
  getItemSummary: (item) => item.title,
};

/**
 * A plan's feature line.
 */
export const PRICING_FEATURE_FIELD: AsheeArrayField<{
  label: string;
  included: boolean;
}> = {
  type: "array",
  label: "Feature lines",
  arrayFields: {
    label: textField("Line"),
    included: {
      type: "radio",
      label: "Included",
      options: [
        { label: "Included", value: true },
        { label: "Not included", value: false },
      ],
    },
  },
  defaultItemProps: { label: "New line", included: true },
  getItemSummary: (item) => item.label,
};

/**
 * One navigation link.
 */
export const LINK_ITEM_FIELDS = {
  label: textField("Link label"),
  href: textField("Link", "/pricing"),
} satisfies Record<string, AsheeTextField>;

/**
 * A testimonial quote.
 */
export const TESTIMONIAL_ITEM_FIELD: AsheeArrayField<{
  quote: string;
  name: string;
  role: string;
}> = {
  type: "array",
  label: "Quotes",
  arrayFields: {
    quote: textareaField("Quote"),
    name: textField("Name"),
    role: textField("Role"),
  },
  defaultItemProps: {
    quote: "They send twice as fast as they used to.",
    name: "New customer",
    role: "",
  },
  getItemSummary: (item) => item.name,
};
