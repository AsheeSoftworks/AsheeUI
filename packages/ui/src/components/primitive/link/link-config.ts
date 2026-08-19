import type { Color } from "../../../shared/variant";
import type {
  FontWeight,
  LineHeight,
} from "../../../theme/typography/typography-config";

export type LinkVariant = "default" | "muted" | "subtle";
export type LinkUnderline = "always" | "hover" | "never";
export type LinkSizeKey = "sm" | "md" | "lg";

export interface LinkConfig {
  variant?: LinkVariant;
  color?: Color;
  size?: LinkSizeKey;
  underline?: LinkUnderline;
  weight?: keyof FontWeight;
  lineHeight?: keyof LineHeight;
  isExternal?: boolean;
  className?: string;
}

export const defaultLinkConfig: LinkConfig = {
  size: "md",
  underline: "hover",
  weight: "medium",
  lineHeight: "base",
  isExternal: false,
};

export const FALLBACK_LINK_CONFIG = {
  size: "md",
  variant: "default",
  color: "primary",
  underline: "hover",
  weight: "medium",
  lineHeight: "base",
  isExternal: false,
} as const;
