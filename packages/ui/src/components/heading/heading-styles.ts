import type {
  FontWeight,
  LetterSpacing,
  LineHeight,
} from "../../theme/typography/typography-config";
import type { HeadingLevel } from "./heading-config";

export const HEADING_LEVEL_CLASS: Record<HeadingLevel, string> = {
  1: "text-3xl lg:text-4xl font-bold leading-tight tracking-tight",
  2: "text-2xl lg:text-3xl font-bold leading-tight tracking-tight",
  3: "text-xl lg:text-2xl font-semibold leading-snug tracking-normal",
  4: "text-lg lg:text-xl font-semibold leading-normal tracking-normal",
  5: "text-base lg:text-lg font-medium leading-normal tracking-normal",
  6: "text-sm lg:text-base font-medium leading-normal tracking-normal",
};

export const HEADING_WEIGHT_CLASS: Record<keyof FontWeight | string, string> = {
  thin: "font-thin",
  extralight: "font-extralight",
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
  black: "font-black",
};

export const HEADING_LINE_HEIGHT_CLASS: Record<
  keyof LineHeight | string,
  string
> = {
  none: "leading-none",
  tight: "leading-tight",
  short: "leading-snug",
  snug: "leading-snug",
  normal: "leading-normal",
  base: "leading-normal",
  relaxed: "leading-relaxed",
  loose: "leading-loose",
};

export const HEADING_LETTER_SPACING_CLASS: Record<
  keyof LetterSpacing | string,
  string
> = {
  tighter: "tracking-tighter",
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
  wider: "tracking-wider",
  widest: "tracking-widest",
};
