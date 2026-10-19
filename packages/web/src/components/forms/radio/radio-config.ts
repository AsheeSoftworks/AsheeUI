/**
 * Radio configuration for the web renderer.
 *
 * The radio's options are the field family's, with one substitution: the treatment it
 * resolves is not the family's `variant` but the two shapes a radio is drawn in. That
 * contract lives in `@asheeui/core` and is re-exported here, so a consumer configures
 * `components.radio` with the same keys on both platforms.
 *
 * What stays with the renderer is the value each option *defaults to* on the web — a
 * radio is round and is drawn as a circle rather than as a card — and the registration
 * itself.
 */

import { type RadioConfig, registerComponentDefaults } from "@asheeui/core";
import { defaultInputConfig } from "../input";

export type { RadioConfig, RadioSizeKey, RadioVariant } from "@asheeui/core";
export { FALLBACK_RADIO_CONFIG } from "@asheeui/core";

/**
 * Default config values registered for the Radio component.
 * Sets radius to "full" for circular radio buttons.
 */
export const defaultRadioConfig: RadioConfig = {
  ...defaultInputConfig,
  radius: "full",
  variant: "default",
};

registerComponentDefaults("radio", defaultRadioConfig);
