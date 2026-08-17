import type { Radius, Size } from "@ashee/theme";
import type { AnimationProp } from "../../../libs/motion/types";

export type ImageFit = "cover" | "contain" | "fill" | "none" | "scale-down";
export type ImageRatioKey = "auto" | "square" | "video" | "portrait";

export interface ImageConfig {
  fit?: ImageFit;
  ratio?: ImageRatioKey;
  radius?: keyof Radius;
  shadow?: keyof Size;
  animation?: AnimationProp;
  loading?: "lazy" | "eager";
  showSkeleton?: boolean;
  className?: string;
}
