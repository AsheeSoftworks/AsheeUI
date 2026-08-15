export type MarqueeAxis = "x" | "y";
export type MarqueeDirection = "forward" | "reverse";
export type MarqueeSpeedPreset = "slow" | "normal" | "fast";

export interface MarqueeConfig {
  axis?: MarqueeAxis;
  direction?: MarqueeDirection;
  speed?: MarqueeSpeedPreset | number;
  gap?: string;
  pauseOnHover?: boolean;
  fadeEdges?: boolean;
  className?: string;
}
