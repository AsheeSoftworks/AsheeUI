import type { AnimationProp } from "../../../motion/types";

export type ParallaxOverlay = "dark" | "light" | "radial" | "none";

export interface ParallaxLayer {
  id?: string;
  content: React.ReactNode;
  /** Speed coefficient for translation. Positive numbers scroll upwards, negative scroll downwards. */
  speed?: number;
  className?: string;
}

export interface ParallaxConfig {
  overlay?: ParallaxOverlay;
  animation?: AnimationProp;
  disableAnimation?: boolean;
  bgSpeed?: number;
  contentSpeed?: number;
  className?: string;
}
