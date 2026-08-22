import { registerComponentDefaults } from "../../libs/registry";
import type { AnimationProp } from "../../motion/types";
import type { Color, Variant } from "../../shared/variant";
import type { Radius } from "../../theme/radius/radius-config";

export type ResizableOrientation = "horizontal" | "vertical";

export interface ResizableScreenConfig {
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  step?: number;
  orientation?: ResizableOrientation;
  handleVariant?: Variant;
  handleColor?: Color;
  handleRadius?: keyof Radius;
  hideHandle?: boolean;
  animation?: AnimationProp;
  className?: string;
  handleClassName?: string;
}

export const defaultResizableScreenConfig: ResizableScreenConfig = {
  defaultSize: 50,
  minSize: 20,
  maxSize: 80,
  step: 2,
  orientation: "horizontal",
  animation: "fade",
  handleRadius: "full",
};

export const FALLBACK_RESIZABLE_SCREEN_CONFIG = {
  defaultSize: 50,
  minSize: 20,
  maxSize: 80,
  step: 2,
  orientation: "horizontal" as ResizableOrientation,
  handleVariant: "bordered" as Variant,
  handleColor: "primary" as Color,
  handleRadius: "full",
  hideHandle: false,
  animation: "fade",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    resizableScreen: ResizableScreenConfig;
  }
}

registerComponentDefaults("resizableScreen", defaultResizableScreenConfig);
