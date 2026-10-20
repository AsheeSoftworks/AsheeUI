/**
 * Marquee component configuration for AsheeUI.
 *
 * This file registers the values the marquee defaults to on the web, so the component-level
 * fallback tier of the theme cascade has a value to resolve. The options themselves, and the
 * types that name them, live in `@asheeui/core`: they are the framework's marquee contract
 * rather than a web renderer's, and the native renderer reads the same ones from the same
 * place. What stays here is the web default values and the registration that puts them in
 * the web registry.
 */

import { type MarqueeConfig, registerComponentDefaults } from "@asheeui/core";

export type {
  MarqueeAxis,
  MarqueeConfig,
  MarqueeDirection,
  MarqueeSpeedPreset,
} from "@asheeui/core";

/**
 * Default config values registered for the Marquee component.
 */
export const defaultMarqueeConfig: MarqueeConfig = {
  axis: "x",
  direction: "forward",
  speed: "normal",
  gap: "1.5rem",
  pauseOnHover: false,
  fadeEdges: false,
  isAnimated: true,
};

registerComponentDefaults("marquee", defaultMarqueeConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 * These values are used when instance props, component config,
 * and global defaults are all undefined.
 *
 * They agree with {@link defaultMarqueeConfig}: a fallback that differed from the value
 * registered one tier up would make an option change meaning when the section it was
 * configured in happened not to resolve, so `pauseOnHover` and `fadeEdges` are `false`
 * here exactly as they are there and in the documented defaults.
 */
export const FALLBACK_MARQUEE_CONFIG = {
  axis: "x" as const,
  direction: "forward" as const,
  speed: "normal" as const,
  gap: "1.5rem",
  pauseOnHover: false,
  fadeEdges: false,
  isAnimated: true,
} as const;
