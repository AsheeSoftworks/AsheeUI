/**
 * The field family's configuration face, shared by both platforms.
 *
 * A field is not one component but a shape several components wear: a text field, a
 * picker, a set of radio buttons and a group of switches all present a label, a
 * description, a message and a validation status the same way, and all of them read
 * the same token names. That shared shape lives here rather than in either renderer,
 * so a consumer configures `components.field` once and both platforms read the same
 * keys, and so a component that joins the family inherits the vocabulary instead of
 * restating it.
 *
 * What a renderer keeps for itself is the value each option *defaults to* and the
 * class strings it compiles: a web field is sized for pointer precision and a native
 * field for a thumb.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `field` here is what makes `components.field` a known
 * configuration section, on every platform, without each renderer restating it.
 */

import type { Radius, Size } from "../../shared/radius";
import type { Color, Variant } from "../../shared/variant";

/**
 * Density of a field, named as the family names it.
 *
 * It is the shared `Size` union under the name a field uses, so a component's
 * `size` prop reads as the field scale rather than as a generic token.
 */
export type FieldSizeKey = Size;

/**
 * Validation status of a field.
 *
 * A field's status is a statement about the *user's* input rather than about the
 * component's colour, which is why the two are separate axes: a consumer says the
 * field failed, and each renderer decides what a failure looks like. Both platforms
 * accept the same four words, so a validation library reports one vocabulary.
 */
export type FieldStatus = "default" | "error" | "warning" | "success";

/**
 * Alignment of the label relative to the field.
 */
export type LabelAlign = "left" | "center" | "right";

/**
 * Theme configuration options shared by every field component.
 *
 * Set under `components.field` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade. Individual components may
 * extend this interface with their own properties.
 */
export interface FieldConfig {
  /**
   * Density of the field.
   * Controls the height, padding, and font size.
   *
   * @default "md"
   */
  size?: FieldSizeKey;

  /**
   * Corner rounding of the field.
   *
   * @default "md"
   */
  radius?: Radius;

  /**
   * Surface treatment of the field.
   *
   * @default "bordered"
   */
  variant?: Variant;

  /**
   * Accent colour of the field while it holds focus.
   *
   * @default "primary"
   */
  color?: Color;

  /**
   * Alignment of the label relative to the field.
   *
   * @default "left"
   */
  labelAlign?: LabelAlign;

  /**
   * Whether the field stretches to fill its parent's width.
   *
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Validation status of the field.
   * Controls the accent the field takes and the tone of its message.
   *
   * @default "default"
   */
  status?: FieldStatus;
}

/**
 * The values a field falls back to when no tier provides one.
 *
 * A field has no other source for these: the platform's `defaultVariant` and
 * `defaultColor` are the framework's opinion about *controls*, and a field that
 * inherited them would change appearance with a consumer's button configuration.
 * `defaultVariant` is therefore deliberately absent from the tiers the field reads,
 * and this object is the bottom of its cascade.
 */
export const FALLBACK_FIELD_CONFIG: Required<FieldConfig> = {
  size: "md",
  radius: "md",
  variant: "bordered",
  color: "primary",
  labelAlign: "left",
  fullWidth: false,
  status: "default",
};

/**
 * Whether a status describes a field the user has to correct.
 *
 * The framework has four status names but only one of them means the value is
 * wrong, and every platform has somewhere to say so: the web marks the input
 * `aria-invalid` and the message a live region, and native does the same through its
 * own accessibility properties. Naming the question once keeps the answer from
 * drifting between the renderers that ask it.
 *
 * @param status - The resolved validation status.
 * @returns Whether the field is in the failed state.
 *
 * @example
 * ```ts
 * isFieldInvalid("error"); // true
 * isFieldInvalid("warning"); // false
 * ```
 */
export function isFieldInvalid(status: FieldStatus): boolean {
  return status === "error";
}

/**
 * Resolve the accent a field takes from its validation status.
 *
 * A status outranks the field's configured colour: an application that accents its
 * fields with `secondary` has not asked for a failed field to be accented with it,
 * so a failed, warning or successful field takes the semantic role instead, and a
 * field with nothing to report keeps the colour the consumer chose.
 *
 * Both renderers state the same rule; a component that resolves its own accent
 * rather than restating this one is what keeps a form's fields agreeing with each
 * other.
 *
 * @param status - The resolved validation status.
 * @param fallback - The colour the field takes when nothing has gone wrong.
 * @returns The colour role the field takes.
 *
 * @example
 * ```ts
 * resolveFieldStatusColor("error", "secondary"); // "danger"
 * resolveFieldStatusColor("default", "secondary"); // "secondary"
 * ```
 */
export function resolveFieldStatusColor(
  status: FieldStatus,
  fallback: Color,
): Color {
  switch (status) {
    case "error":
      return "danger";
    case "warning":
      return "warning";
    case "success":
      return "success";
    default:
      return fallback;
  }
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    field: FieldConfig;
  }
}
