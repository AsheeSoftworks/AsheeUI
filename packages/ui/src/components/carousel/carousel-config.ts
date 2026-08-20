import type { ReactNode } from "react";
import { registerComponentDefaults } from "../../libs/registry";
import type { AnimationProp } from "../../motion/types";
import type { Radius } from "../../theme/token/radius/radius-config";

export type CarouselVariant = "default" | "cards" | "bordered" | "ghost";
export type CarouselSizeKey = "sm" | "md" | "lg";

export interface CarouselItem {
  id?: string;
  content: ReactNode;
}

export interface CarouselConfig {
  variant?: CarouselVariant;
  size?: CarouselSizeKey;
  radius?: keyof Radius;
  animation?: AnimationProp;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  loop?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}

export const defaultCarouselConfig: CarouselConfig = {
  size: "md",
  animation: "none",
  autoPlay: false,
  autoPlayInterval: 5000,
  loop: true,
  showControls: true,
  showIndicators: true,
  pauseOnHover: true,
};

export const FALLBACK_CAROUSEL_CONFIG = {
  size: "md",
  variant: "default",
  radius: "lg",
  autoPlay: false,
  autoPlayInterval: 5000,
  loop: true,
  showControls: true,
  showIndicators: true,
  pauseOnHover: true,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    carousel: CarouselConfig;
  }
}

registerComponentDefaults("carousel", defaultCarouselConfig);
