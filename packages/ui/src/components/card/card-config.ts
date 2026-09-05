import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";
import type { ImageFit, ImageRatioKey } from "../image/image-config";

export type CardVariant = "elevated" | "bordered" | "flat" | "ghost";
export type CardImagePosition = "top" | "bottom" | "background";

export interface CardConfig {
  variant?: CardVariant;
  size?: Size;
  radius?: Radius;
  imagePosition?: CardImagePosition;
  imageRatio?: ImageRatioKey;
  imageFit?: ImageFit;
  isClickable?: boolean;
  animate?: boolean;
}

export const defaultCardConfig: CardConfig = {
  size: "md",
  imagePosition: "top",
  imageRatio: "video",
  imageFit: "cover",
  isClickable: false,
  animate: true,
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    card: CardConfig;
  }
}

registerComponentDefaults("card", defaultCardConfig);

export const FALLBACK_CARD_CONFIG = {
  size: "md",
  variant: "bordered",
  radius: "md",
  imagePosition: "top",
  imageRatio: "video",
  imageFit: "cover",
  isClickable: false,
  animate: true,
} as const;
