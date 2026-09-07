/**
 * Radio context for AsheeUI.
 * This file provides the RadioContext and useRadioGroupContext hook
 * for sharing state between RadioGroup and Radio components. The context
 * allows Radio components to inherit values like name, value, size,
 * color, and disabled state from their parent RadioGroup.
 */
"use client";

import { createContext, useContext } from "react";
import type { Color } from "../../shared";
import type { FieldSizeKey, FieldStatus } from "../field/field-config";
import type { RadioVariant } from "./radio-config";

/**
 * Context value for the radio group.
 * Contains all shared props that Radio components inherit from their group.
 */
export interface RadioContextValue {
  /**
   * Name attribute for all radio inputs in the group.
   */
  name?: string;

  /**
   * Currently selected value in the group.
   */
  value?: string;

  /**
   * Callback fired when the selection changes.
   */
  onChange?: (value: string) => void;

  /**
   * Size scale for all radios in the group.
   */
  size?: FieldSizeKey;

  /**
   * Theme accent color for all radios in the group.
   */
  color?: Color;

  /**
   * Visual style variant for all radios in the group.
   */
  variant?: RadioVariant;

  /**
   * Whether all radios in the group are disabled.
   */
  disabled?: boolean;

  /**
   * Validation status for the group.
   */
  status?: FieldStatus;
}

/**
 * React context for the radio group state.
 */
export const RadioContext = createContext<RadioContextValue | null>(null);

/**
 * Hook for accessing the radio group context.
 * Returns the current context value or null if used outside a RadioGroup.
 *
 * @returns The radio group context value, or null if not in a group.
 *
 * @example
 * ```tsx
 * const group = useRadioGroupContext();
 * const isChecked = group ? group.value === value : controlledChecked;
 * ```
 */
export const useRadioGroupContext = () => useContext(RadioContext);
