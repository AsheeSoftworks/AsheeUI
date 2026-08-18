import type { Size } from "../../../theme/token/token";
import type {
  FontWeight,
  LineHeight,
} from "../../../theme/typography/typography-config";

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
