import { registerComponentDefaults } from "../../libs/registry";
import type { Spacing } from "../../theme/spacing/spacing-config";

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

export const defaultFlexConfig: FlexConfig = {
  direction: "row",
  align: "stretch",
  justify: "start",
  gap: "md",
  wrap: false,
};

export const FALLBACK_FLEX_CONFIG = {
  direction: "row" as FlexDirection,
  align: "stretch" as FlexAlign,
  justify: "start" as FlexJustify,
  gap: "md" as keyof Spacing,
  wrap: false,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    flex: FlexConfig;
  }
}

registerComponentDefaults("flex", defaultFlexConfig);
