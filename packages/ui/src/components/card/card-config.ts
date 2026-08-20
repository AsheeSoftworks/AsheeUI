import type { AnimationProp } from "../../motion/types";
import { registerComponentDefaults } from "../../libs/registry";
import type { Shadow } from "../../theme/shadow/shadow-config";
import type { Radius } from "../../theme/token/radius/radius-config";
import type { ImageFit, ImageRatioKey } from "../image/image-config";

export type CardVariant = "elevated" | "bordered" | "flat" | "ghost";
export type CardSizeKey = "sm" | "md" | "lg";
export type CardImagePosition =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "background";

export interface CardConfig {
  variant?: CardVariant;
  size?: CardSizeKey;
  radius?: keyof Radius;
  shadow?: keyof Shadow;
  animation?: AnimationProp;
  imagePosition?: CardImagePosition;
  imageRatio?: ImageRatioKey;
  imageFit?: ImageFit;
  isClickable?: boolean;
  className?: string;
}

export const defaultCardConfig: CardConfig = {
  size: "md",
  animation: "none",
  imagePosition: "top",
  imageRatio: "video",
  imageFit: "cover",
  isClickable: false,
};

export const FALLBACK_CARD_CONFIG = {
  size: "md",
  variant: "bordered",
  radius: "md",
  shadow: "none",
  animation: "none",
  imagePosition: "top",
  imageRatio: "video",
  imageFit: "cover",
  isClickable: false,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    card: CardConfig;
  }
}

registerComponentDefaults("card", defaultCardConfig);
