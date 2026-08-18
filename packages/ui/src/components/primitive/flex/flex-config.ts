import type { Spacing } from "../../../theme/token/spacing/spacing-config";

export type FlexDirection = "row" | "row-reverse" | "col" | "col-reverse";
export type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type FlexJustify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

export interface FlexConfig {
  direction?: FlexDirection;
  align?: FlexAlign;
  justify?: FlexJustify;
  gap?: keyof Spacing;
  wrap?: boolean;
  className?: string;
}
