import type { FontWeight, LineHeight, ResponsiveValue } from "@ashee/theme";
import type { Color } from "../../../shared/variant";

export type LinkVariant = "default" | "muted" | "subtle";
export type LinkUnderline = "always" | "hover" | "never";
export type LinkSizeKey = "sm" | "md" | "lg";

export interface LinkSizeValue {
  fontSize: ResponsiveValue<string>;
  gap: ResponsiveValue<string>;
  iconSize: ResponsiveValue<string>;
}

export interface LinkSizeScale {
  default: LinkSizeKey;
  values: Record<LinkSizeKey, LinkSizeValue>;
}

export interface LinkConfig {
  variant?: LinkVariant;
  color?: Color;
  size?: LinkSizeScale;
  underline?: LinkUnderline;
  weight?: keyof FontWeight;
  lineHeight?: keyof LineHeight;
  isExternal?: boolean;
  className?: string;
}
