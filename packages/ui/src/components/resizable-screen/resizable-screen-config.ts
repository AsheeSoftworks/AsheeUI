import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";
import type { Color, Variant } from "../../shared/variant";

export type ResizableOrientation = "horizontal" | "vertical";

export interface ResizableScreenConfig {
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  step?: number;
  orientation?: ResizableOrientation;
  handleVariant?: Variant;
  handleColor?: Color;
  handleRadius?: Radius;
  hideHandle?: boolean;
  className?: string;
  handleClassName?: string;
}

export const defaultResizableScreenConfig: ResizableScreenConfig = {
  defaultSize: 50,
  minSize: 20,
  maxSize: 80,
  step: 2,
  orientation: "horizontal",
  handleRadius: "full",
};

export const FALLBACK_RESIZABLE_SCREEN_CONFIG: Required<ResizableScreenConfig> =
  {
    defaultSize: 50,
    minSize: 20,
    maxSize: 80,
    step: 2,
    orientation: "horizontal",
    handleVariant: "bordered",
    handleColor: "primary",
    handleRadius: "full",
    hideHandle: false,
    className: "",
    handleClassName: "",
  } as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    resizableScreen: ResizableScreenConfig;
  }
}

registerComponentDefaults("resizableScreen", defaultResizableScreenConfig);
