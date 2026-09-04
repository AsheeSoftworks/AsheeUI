import type { ReactNode } from "react";
import { registerComponentDefaults } from "../../libs/registry";
import type { Radius } from "../../shared/radius";
import type { Size } from "../../shared/size";

export type CarouselVariant = "bordered" | "ghost";

export interface CarouselItem {
  id?: string;
  content: ReactNode;
}

export interface CarouselConfig {
  variant?: CarouselVariant;
  size?: Size;
  radius?: Radius;
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
  autoPlay: false,
  autoPlayInterval: 5000,
  loop: true,
  showControls: true,
  showIndicators: true,
  pauseOnHover: true,
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    carousel: CarouselConfig;
  }
}

registerComponentDefaults("carousel", defaultCarouselConfig);

export const FALLBACK_CAROUSEL_CONFIG = {
  size: "md",
  variant: "bordered",
  radius: "lg",
  autoPlay: false,
  autoPlayInterval: 5000,
  loop: true,
  showControls: true,
  showIndicators: true,
  pauseOnHover: true,
} as const;
