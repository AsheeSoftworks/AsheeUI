/**
 * PinInput configuration for the web renderer.
 *
 * The code field's options are shared, so the contract lives in `@asheeui/core` and is
 * re-exported here: a consumer configures `components.pininput` with the same keys on both
 * platforms, and the component reads the same shape its native counterpart does.
 *
 * What stays with the renderer is the value each option *defaults to* on the web, and the
 * registration itself.
 */

import { type PinInputConfig, registerComponentDefaults } from "@asheeui/core";

export type {
  PinInputConfig,
  PinInputMode,
  PinInputSize,
} from "@asheeui/core";
export { FALLBACK_PIN_INPUT_CONFIG } from "@asheeui/core";

/**
 * Default config values registered for the PinInput component.
 */
export const defaultPinInputConfig: PinInputConfig = {
  length: 4,
  mode: "numeric",
  size: "md",
  masked: false,
  isDisabled: false,
  isInvalid: false,
};

registerComponentDefaults("pininput", defaultPinInputConfig);
