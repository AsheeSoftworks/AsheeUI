import type { Radius, ResponsiveValue } from "@ashee/theme";
import type { ReactNode } from "react";
import type { AnimationProp } from "../../../motion/types";
import type { Variant } from "../../../shared/variant";
import type { ButtonSizeKey } from "../button/button-config";

export type ButtonDropdownSizeKey = ButtonSizeKey;

export interface ButtonDropdownList {
  label: string;
  onClick?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  [key: string]: unknown;
}

export interface ButtonDropdownSizeValue {
  height: ResponsiveValue<string>;
  paddingX: ResponsiveValue<string>;
  fontSize: ResponsiveValue<string>;
}

export interface ButtonDropdownSizeScale {
  default: ButtonDropdownSizeKey;
  values: Record<ButtonDropdownSizeKey, ButtonDropdownSizeValue>;
}

export interface ButtonDropdownConfig {
  size?: ButtonDropdownSizeScale;
  radius?: keyof Radius;
  variant?: Variant;
  animation?: AnimationProp;
  className?: string;
}
