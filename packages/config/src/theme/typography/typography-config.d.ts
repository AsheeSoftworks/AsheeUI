import type { Size } from "../../token/token";

export type FontWeight = {
  light: string;
  normal: string;
  medium: string;
  semibold: string;
  bold: string;
};

export type LineHeight = {
  short: string;
  base: string;
  tall: string;
};

export type LetterSpacing = {
  tight: string;
  normal: string;
  wide: string;
};

export type FontFamily = {
  sans: string;
  serif: string;
  mono: string;
};

type TextTransform = "none" | "uppercase" | "lowercase" | "capitalize";

type TextDecoration = "none" | "underline" | "line-through";

type TextAlign = "left" | "center" | "right" | "justify";

type TextOverflow = "clip" | "ellipsis";

type WhiteSpace = "normal" | "nowrap" | "pre" | "pre-line" | "pre-wrap";

type WordBreak = "normal" | "break-all" | "keep-all" | "break-word";

export interface TypographyConfig {
  size: Size;
  weight: FontWeight;
  lineHeight: LineHeight;
  spacing: LetterSpacing;
  family: FontFamily;
  transform: TextTransform;
  decoration: TextDecoration;
  align: TextAlign;
  overflow: TextOverflow;
  whitespace: WhiteSpace;
  wordbreak: WordBreak;
}
