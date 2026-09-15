/**
 * Adapters between builder values and framework props.
 *
 * A builder holds plain strings, because that is what a form control produces.
 * The framework's props are unions of named tokens. These adapters are the
 * single place where one becomes the other, so a block's render function stays a
 * mapping of names rather than a parsing exercise, and a value that is not
 * accepted by the component resolves to undefined rather than to a wrong class.
 */

import type { GridColumns } from "../components/grid/grid-config";
import type { Variant } from "../shared";

/**
 * One action as a builder holds it.
 *
 * The keys are required because a Puck field set is a form the builder fills in,
 * and `defaultProps` supplies a complete value for every block that offers one.
 * A published payload can still arrive with a key missing, which is why the
 * adapter that reads it accepts a partial value.
 */
export type BuilderAction = {
  /** Wording of the action. */
  label: string;

  /** Destination of the action. */
  href: string;

  /** Emphasis of the action. */
  variant: string;
};

/** The variants an action accepts, used to validate a builder value. */
const ACTION_VARIANTS: readonly string[] = [
  "solid",
  "faded",
  "bordered",
  "ghost",
  "underlined",
];

/**
 * Turn a builder action into a configured action.
 *
 * @param action - The action the builder holds, which may be missing a key when
 * it comes from a stored page rather than from the editor.
 * @returns The action the framework renders, or undefined when it has no
 * wording, because an action without a name cannot be read or clicked.
 */
export function toAction(action: Partial<BuilderAction> | undefined) {
  if (!action?.label) {
    return undefined;
  }

  return {
    label: action.label,
    href: action.href,
    variant:
      action.variant && ACTION_VARIANTS.includes(action.variant)
        ? (action.variant as Variant)
        : undefined,
  };
}

/**
 * Turn a builder column count into a grid column count.
 *
 * @param value - The column count as a string, which is what a select field
 * holds.
 * @returns The numeric column count, or undefined when the value is not one the
 * grid accepts.
 */
export function toColumns(value: string | undefined): GridColumns | undefined {
  if (!value) return undefined;

  const parsed = Number(value);
  if (![1, 2, 3, 4, 6, 12].includes(parsed)) return undefined;

  return parsed as GridColumns;
}
