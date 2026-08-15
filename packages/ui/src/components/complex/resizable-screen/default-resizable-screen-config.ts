import type { ResizableScreenConfig } from "./resizable-screen-config";

export const defaultResizableScreenConfig: ResizableScreenConfig = {
  defaultSize: 50,
  minSize: 20,
  maxSize: 80,
  step: 2,
  orientation: "horizontal",
  animation: "fade",
  handleRadius: "full",
};
