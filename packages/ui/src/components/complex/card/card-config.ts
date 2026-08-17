import type { Radius, ResponsiveValue, Shadow } from "@ashee/theme";
import type { AnimationProp } from "../../../libs/motion/types";
import type {
  ImageFit,
  ImageRatioKey,
} from "../../primitive/image/image-config";

export type CardVariant = "elevated" | "bordered" | "flat" | "ghost";
export type CardSizeKey = "sm" | "md" | "lg";
export type CardImagePosition =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "background";

export interface CardSizeValue {
  paddingX: ResponsiveValue<string>;
  paddingY: ResponsiveValue<string>;
  gap: ResponsiveValue<string>;
}

export interface CardSizeScale {
  default: CardSizeKey;
  values: Record<CardSizeKey, CardSizeValue>;
}

export interface CardConfig {
  variant?: CardVariant;
  size?: CardSizeScale;
  radius?: keyof Radius;
  shadow?: keyof Shadow;
  animation?: AnimationProp;
  imagePosition?: CardImagePosition;
  imageRatio?: ImageRatioKey;
  imageFit?: ImageFit;
  isClickable?: boolean;
  className?: string;
}
