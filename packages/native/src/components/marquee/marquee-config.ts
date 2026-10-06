/**
 * Marquee component configuration for the native package.
 *
 * The options are the ones the framework's marquee contract names, so `components.marquee`
 * is configured the same way on both platforms, and the types are re-exported from
 * `@asheeui/core` rather than restated here. What stays with the renderer is the value each
 * option defaults to on the platform, and the registration that puts it in the native
 * registry.
 */

import type { MarqueeConfig } from "@asheeui/core";
import { registerNativeComponentDefaults } from "../../config/registry";

export type {
  MarqueeAxis,
  MarqueeConfig,
  MarqueeDirection,
  MarqueeSpeedPreset,
} from "@asheeui/core";

/**
 * Configuration options for the native Marquee.
 */
export type NativeMarqueeConfig = MarqueeConfig;

/**
 * The defaults the Marquee registers with the native registry.
 *
 * They are the web's own values: content moves along the horizontal axis at the normal
 * speed, a gap and a half apart, and it moves unless something says otherwise. The platform
 * adds nothing to them, because what a marquee is has nothing to do with the pointer: a
 * device shows the same band of content the browser shows.
 */
export const defaultNativeMarqueeConfig: NativeMarqueeConfig = {
  axis: "x",
  direction: "forward",
  speed: "normal",
  gap: "1.5rem",
  pauseOnHover: false,
  fadeEdges: false,
  isAnimated: true,
};

declare module "../../config/registry" {
  interface NativeComponentConfigRegistry {
    marquee: NativeMarqueeConfig;
  }
}

registerNativeComponentDefaults("marquee", defaultNativeMarqueeConfig);

/**
 * The values the Marquee falls back to when no tier provides one.
 *
 * They are the web's own fallback values, including the two the platform cannot act on
 * (`pauseOnHover` and `fadeEdges`): the option still resolves, so a value one platform
 * cannot honour does not silently become a different value here.
 */
export const FALLBACK_NATIVE_MARQUEE_CONFIG: Required<NativeMarqueeConfig> = {
  axis: "x",
  direction: "forward",
  speed: "normal",
  gap: "1.5rem",
  pauseOnHover: true,
  fadeEdges: true,
  isAnimated: true,
};
