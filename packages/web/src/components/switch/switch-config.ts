/**
 * Switch configuration for the web renderer.
 *
 * The switch's options are the field family's, so the contract lives in
 * `@asheeui/core` and is re-exported here: a consumer configures `components.switch`
 * with the same keys on both platforms, and the component reads the same shape its
 * native counterpart does.
 *
 * What stays with the renderer is the value each option *defaults to* on the web — a
 * switch's track is rounded, because a switch is a track and a knob rather than a box —
 * and the registration itself.
 */

import { registerComponentDefaults, type SwitchConfig } from "@asheeui/core";
import { defaultInputConfig } from "../input";

export type { SwitchConfig, SwitchSizeKey } from "@asheeui/core";
export { FALLBACK_SWITCH_CONFIG } from "@asheeui/core";

/**
 * Default config values registered for the Switch component.
 * Inherits the default field configuration and rounds the track.
 */
export const defaultSwitchConfig: SwitchConfig = {
  ...defaultInputConfig,
  radius: "full",
};

registerComponentDefaults("switch", defaultSwitchConfig);
