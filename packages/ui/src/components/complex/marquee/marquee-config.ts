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

export const defaultMarqueeConfig: MarqueeConfig = {
  axis: "x",
  direction: "forward",
  speed: "normal",
  gap: "1.5rem",
  pauseOnHover: true,
  fadeEdges: true,
};

export const FALLBACK_MARQUEE_CONFIG = {
  axis: "x" as MarqueeAxis,
  direction: "forward" as MarqueeDirection,
  speed: "normal" as MarqueeSpeedPreset,
  gap: "1.5rem",
  pauseOnHover: true,
  fadeEdges: true,
} as const;
