import type { FontWeight, LineHeight, ResponsiveValue } from "@ashee/theme";
import type { AnimationProp } from "../../../motion/types";

export type LinkVariant = "default" | "primary" | "muted" | "subtle" | "danger";
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
  size?: LinkSizeScale;
  underline?: LinkUnderline;
  weight?: keyof FontWeight;
  lineHeight?: keyof LineHeight;
  animation?: AnimationProp;
  isExternal?: boolean;
  className?: string;
}
