"use client";

import { createContext, useContext } from "react";
import type { Color } from "../../shared/variant";
import type { FieldSizeKey, FieldStatus } from "../field/field-config";
import type { RadioVariant } from "./radio-config";

export interface RadioContextValue {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  size?: FieldSizeKey;
  color?: Color;
  variant?: RadioVariant;
  disabled?: boolean;
  status?: FieldStatus;
}

export const RadioContext = createContext<RadioContextValue | null>(null);

export const useRadioGroupContext = () => useContext(RadioContext);
