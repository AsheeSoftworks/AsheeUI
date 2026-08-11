import type { FontWeight, LineHeight, Size } from "@ashee/theme";

export type TextAs =
  | "p"
  | "span"
  | "div"
  | "label"
  | "strong"
  | "em"
  | "b"
  | "i"
  | "small"
  | "sub"
  | "sup"
  | "del"
  | "ins"
  | "mark";

export interface TextConfig {
  as?: TextAs;
  size?: keyof Size;
  weight?: keyof FontWeight;
  lineHeight?: keyof LineHeight;
  className?: string;
}
