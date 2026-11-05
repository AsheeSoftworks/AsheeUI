/**
 * Checkbox context for the native package.
 *
 * The context is what makes a group of checkboxes one control rather than
 * several: each checkbox reads the selected values, the shared options and the
 * disabled state from the group it sits in, so a consumer states them once. It
 * is the same shape the web context has, because what a checkbox inherits is a
 * property of the control rather than of the platform.
 *
 * It is an internal module: it is not exported from the package entry point,
 * because a consumer composes a `CheckboxGroup` with `Checkbox` children rather
 * than wiring the context itself.
 */

import type { Color, FieldSizeKey, FieldStatus } from "@asheeui/core";
import { createContext, useContext } from "react";

/**
 * Context value for a group of checkboxes.
 * Contains every option a checkbox inherits from the group it sits in.
 */
export interface CheckboxContextValue {
  /** The values the group currently holds. */
  value: readonly string[];

  /** Called with the next set of selected values. */
  onChange?: (value: string[]) => void;

  /** Size scale for every checkbox in the group. */
  size?: FieldSizeKey;

  /** Theme accent colour for every checkbox in the group. */
  color?: Color;

  /** Whether every checkbox in the group is unavailable. */
  isDisabled?: boolean;

  /** Validation status of the group. */
  status?: FieldStatus;
}

/** State a checkbox reads from the group it sits in. */
export const CheckboxContext = createContext<CheckboxContextValue | null>(null);

/**
 * Read the group a checkbox sits in.
 *
 * @returns The group's state, or null when the checkbox stands alone.
 */
export const useCheckboxGroupContext = () => useContext(CheckboxContext);
