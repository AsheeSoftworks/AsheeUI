import { registerComponentDefaults } from "../../libs/registry";
import type { Size } from "../../theme/size/size";
import type {
  FontWeight,
  LineHeight,
} from "../../theme/typography/typography-config";

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

export const defaultTextConfig: TextConfig = {
  as: "p",
  size: "md",
  weight: "normal",
  lineHeight: "base",
};

export const FALLBACK_TEXT_CONFIG = {
  as: "p",
  size: "md",
  weight: "normal",
  lineHeight: "base",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    text: TextConfig;
  }
}

registerComponentDefaults("text", defaultTextConfig);
