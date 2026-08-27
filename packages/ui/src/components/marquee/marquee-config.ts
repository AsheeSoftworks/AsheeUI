import { registerComponentDefaults } from "../../libs/registry";
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
}

export const defaultMarqueeConfig: MarqueeConfig = {
  axis: "x",
  direction: "forward",
  speed: "normal",
  gap: "1.5rem",
  pauseOnHover: false,
  fadeEdges: false,
};

export const FALLBACK_MARQUEE_CONFIG = {
  axis: "x" as MarqueeAxis,
  direction: "forward" as MarqueeDirection,
  speed: "normal" as MarqueeSpeedPreset,
  gap: "1.5rem",
  pauseOnHover: true,
  fadeEdges: true,
} as const;

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    marquee: MarqueeConfig;
  }
}

registerComponentDefaults("marquee", defaultMarqueeConfig);
