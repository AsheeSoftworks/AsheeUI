import type { AnimationProp } from "../../../motion/types";
import type { Radius } from "../../../theme/token/radius/radius-config";
import type { Size } from "../../../theme/token/token";

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
