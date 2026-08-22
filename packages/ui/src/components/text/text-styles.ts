import type { Size } from "../../theme/size/size";
import type {
  FontWeight,
  LineHeight,
} from "../../theme/typography/typography-config";

export const TEXT_SIZE_CLASS: Record<keyof Size | string, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

export const TEXT_WEIGHT_CLASS: Record<keyof FontWeight | string, string> = {
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

export const TEXT_LINE_HEIGHT_CLASS: Record<keyof LineHeight | string, string> =
  {
    none: "leading-none",
    tight: "leading-tight",
    snug: "leading-snug",
    normal: "leading-normal",
    relaxed: "leading-relaxed",
    loose: "leading-loose",
    base: "leading-normal",
  };
