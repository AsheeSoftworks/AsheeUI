import { registerComponentDefaults } from "../../libs/registry";

export type ResizableOrientation = "horizontal" | "vertical";

export interface ResizableScreenConfig {
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  step?: number;
  orientation?: ResizableOrientation;
  hideHandle?: boolean;
}

export const defaultResizableScreenConfig: ResizableScreenConfig = {
  defaultSize: 50,
  minSize: 20,
  maxSize: 80,
  step: 2,
  orientation: "horizontal",
};

export const FALLBACK_RESIZABLE_SCREEN_CONFIG: Required<ResizableScreenConfig> =
  {
    defaultSize: 50,
    minSize: 20,
    maxSize: 80,
    step: 2,
    orientation: "horizontal",
    hideHandle: false,
  } as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    resizableScreen: ResizableScreenConfig;
  }
}

registerComponentDefaults("resizableScreen", defaultResizableScreenConfig);
