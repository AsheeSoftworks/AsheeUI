import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";

export type ImageFit = "cover" | "contain" | "fill" | "none" | "scale-down";
export type ImageRatioKey = "auto" | "square" | "video" | "portrait";

export interface ImageConfig {
  fit?: ImageFit;
  ratio?: ImageRatioKey;
  radius?: Radius;
  loading?: "lazy" | "eager";
  showSkeleton?: boolean;
  className?: string;
}

export const defaultImageConfig: ImageConfig = {
  fit: "cover",
  ratio: "auto",
  radius: "md",
  loading: "lazy",
  showSkeleton: true,
};

export const FALLBACK_IMAGE_CONFIG: Required<ImageConfig> = {
  fit: "cover",
  ratio: "auto",
  radius: "md",
  loading: "lazy",
  showSkeleton: true,
  className: "",
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    image: ImageConfig;
  }
}

registerComponentDefaults("image", defaultImageConfig);
