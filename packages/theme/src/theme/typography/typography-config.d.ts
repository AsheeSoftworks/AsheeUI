import type { ResponsiveValue } from "../token/responsive/responsive";

export type FontWeight = {
  light: string;
  normal: string;
  medium: string;
  semibold: string;
  bold: string;
};
export type LineHeight = { short: string; base: string; tall: string };
export type LetterSpacing = { tight: string; normal: string; wide: string };
export type FontSizeKey = "xs" | "sm" | "md" | "lg" | "xl";
export type FontSizeScale = Record<FontSizeKey, ResponsiveValue<string>>;

export interface TypographyConfig {
  size: FontSizeScale;
  weight: FontWeight;
  lineHeight: LineHeight;
  letterSpacing: LetterSpacing;
}
