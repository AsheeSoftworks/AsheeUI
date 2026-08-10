import type { AnimationProp } from "../../../motion/types";

export type ResizableOrientation = "horizontal" | "vertical";

export interface ResizableScreenConfig {
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  step?: number;
  orientation?: ResizableOrientation;
  animation?: AnimationProp;
  className?: string;
  handleClassName?: string;
}
