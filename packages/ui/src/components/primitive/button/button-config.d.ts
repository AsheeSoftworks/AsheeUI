import type { ResponsiveValue } from "@ashee/theme";

export type ButtonSizeKey = "sm" | "md" | "lg";

export interface ButtonSizeValue {
  paddingX: ResponsiveValue<string>;
  paddingY: ResponsiveValue<string>;
  fontSize: ResponsiveValue<string>;
  gap: ResponsiveValue<string>;
}

export interface ButtonSizeScale {
  default: ButtonSizeKey;
  values: Record<ButtonSizeKey, ButtonSizeValue>;
}

export interface ButtonConfig {
  variant?: Variant;
  color?: Color;
  size?: ButtonSizeScale;
  radius?: keyof Radius;
  animation?: AnimationProp;
  className?: string;
}
