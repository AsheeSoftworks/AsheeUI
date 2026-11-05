/**
 * Checkbox context for AsheeUI.
 * This file provides the CheckboxContext and useCheckboxGroupContext hook for
 * sharing state between CheckboxGroup and Checkbox components. The context
 * lets a checkbox inherit the group's name, selected values, size, colour and
 * disabled state, so a consumer states them once.
 */
"use client";

import type { Color } from "@asheeui/core";
import { createContext, useContext } from "react";
import type { FieldSizeKey, FieldStatus } from "../field/field-config";

/**
 * Context value for a group of checkboxes.
 * Contains every option a checkbox inherits from the group it sits in.
 */
export interface CheckboxContextValue {
  /**
   * Name attribute shared by every checkbox in the group.
   */
  name?: string | undefined;

  /**
   * Values currently selected in the group.
   */
  value: readonly string[];

  /**
   * Callback fired with the next set of selected values.
   */
  onChange?: ((value: string[]) => void) | undefined;

  /**
   * Size scale for every checkbox in the group.
   */
  size?: FieldSizeKey | undefined;

  /**
   * Theme accent colour for every checkbox in the group.
   */
  color?: Color | undefined;

  /**
   * Whether every checkbox in the group is disabled.
   */
  disabled?: boolean | undefined;

  /**
   * Validation status for the group.
   */
  status?: FieldStatus | undefined;
}

/**
 * React context for the checkbox group state.
 */
export const CheckboxContext = createContext<CheckboxContextValue | null>(null);

/**
 * Hook for accessing the checkbox group context.
 * Returns the current context value or null when the checkbox stands alone.
 *
 * @returns The group's state, or null outside a CheckboxGroup.
 *
 * @example
 * ```tsx
 * const group = useCheckboxGroupContext();
 * const isChecked = group ? group.value.includes(value) : controlledChecked;
 * ```
 */
export const useCheckboxGroupContext = () => useContext(CheckboxContext);
