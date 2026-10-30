/**
 * Centered component configuration for AsheeUI.
 *
 * The *shape* of `components.centered` is `@asheeui/core`'s — the axis, the reserved height and the
 * container options are declared once, for both platforms, in
 * `packages/core/src/components/layouts/centered/centered-config.ts`. This module keeps what is the
 * web's: the defaults it registers and the hard fallbacks it states.
 */

import type { CenteredConfig } from "@asheeui/core";
import { registerComponentDefaults } from "@asheeui/core";

export type { CenteredAxis, CenteredConfig } from "@asheeui/core";

/**
 * Default config values registered for the Centered component.
 * The axis and the container width are pinned; the height is not, because a
 * block that reserves height by default would add space to every layout.
 */
export const defaultCenteredConfig: CenteredConfig = {
  axis: "both",
  contained: false,
  containerSize: "lg",
};

registerComponentDefaults("centered", defaultCenteredConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_CENTERED_CONFIG = {
  axis: "both",
  minHeight: "none",
  contained: false,
  containerSize: "lg",
} satisfies CenteredConfig;
