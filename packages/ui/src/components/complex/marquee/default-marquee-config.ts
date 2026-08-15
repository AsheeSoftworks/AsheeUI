import type { MarqueeConfig, MarqueeSpeedPreset } from "./marquee-config";

export const MARQUEE_SPEED_PRESETS: Record<MarqueeSpeedPreset, number> = {
  slow: 50,
  normal: 30,
  fast: 15,
};

export const defaultMarqueeConfig: MarqueeConfig = {
  axis: "x",
  direction: "forward",
  speed: "normal",
  gap: "1.5rem",
  pauseOnHover: true,
  fadeEdges: true,
};
