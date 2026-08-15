import type { Radius } from "@ashee/theme";
import type { AnimationProp } from "../../../motion/types";
import type { Color, Variant } from "../../../shared/variant";

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
