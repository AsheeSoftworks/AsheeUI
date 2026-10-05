/**
 * Radio context for the native package.
 *
 * The context is what makes a group of radios one control rather than several: each radio
 * reads the selection, the shared options and the disabled state from the group it sits
 * in, so a consumer states them once. It is the same shape the web context has, because
 * what a radio inherits is a property of the control rather than of the platform.
 *
 * It is an internal module: it is not exported from the package entry point, because a
 * consumer composes a `RadioGroup` with `Radio` children rather than wiring the context
 * itself.
 */

import type {
  Color,
  FieldSizeKey,
  FieldStatus,
  RadioVariant,
} from "@asheeui/core";
import { createContext, useContext } from "react";

/**
 * Context value for a group of radios.
 * Contains every option a radio inherits from the group it sits in.
 */
export interface RadioContextValue {
  /** The value the group currently holds. */
  value?: string;

  /** Called with the value the reader picked. */
  onChange?: (value: string) => void;

  /** Size scale for every radio in the group. */
  size?: FieldSizeKey;

  /** Theme accent colour for every radio in the group. */
  color?: Color;

  /** Whether the group draws its options as circles or as cards. */
  variant?: RadioVariant;

  /** Whether every radio in the group is unavailable. */
  isDisabled?: boolean;

  /** Validation status of the group. */
  status?: FieldStatus;
}

/** State a radio reads from the group it sits in. */
export const RadioContext = createContext<RadioContextValue | null>(null);

/**
 * Read the group a radio sits in.
 *
 * @returns The group's state, or null when the radio stands alone.
 */
export const useRadioGroupContext = () => useContext(RadioContext);
