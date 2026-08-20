import type { AnimationProp } from "../../motion/types";
import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../theme/token/radius/radius-config";
import type { Size } from "../../theme/token/token";

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

export const defaultImageConfig: ImageConfig = {
  fit: "cover",
  ratio: "auto",
  loading: "lazy",
  showSkeleton: true,
  animation: "none",
};

export const FALLBACK_IMAGE_CONFIG = {
  fit: "cover" as ImageFit,
  ratio: "auto" as ImageRatioKey,
  radius: "md" as keyof Radius,
  shadow: "none" as keyof Size,
  loading: "lazy" as const,
  showSkeleton: true,
  animation: "none" as AnimationProp,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    image: ImageConfig;
  }
}

registerComponentDefaults("image", defaultImageConfig);
