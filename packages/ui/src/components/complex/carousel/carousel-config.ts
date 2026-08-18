import type { AnimationProp } from "../../../motion/types";
import type { Radius } from "../../../theme/token/radius/radius-config";
import type { ResponsiveValue } from "../../../theme/token/responsive/responsive";

export type CarouselVariant = "default" | "cards" | "bordered" | "ghost";
export type CarouselSizeKey = "sm" | "md" | "lg";

export interface CarouselSizeValue {
  height: ResponsiveValue<string>;
  paddingX: ResponsiveValue<string>;
  paddingY: ResponsiveValue<string>;
}

export interface CarouselSizeScale {
  default: CarouselSizeKey;
  values: Record<CarouselSizeKey, CarouselSizeValue>;
}

export interface CarouselItem {
  id?: string;
  content: React.ReactNode;
}

export interface CarouselConfig {
  variant?: CarouselVariant;
  size?: CarouselSizeScale;
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
