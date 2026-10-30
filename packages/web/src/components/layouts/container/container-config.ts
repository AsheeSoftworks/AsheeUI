/**
 * Container component configuration for AsheeUI.
 *
 * The *shape* of `components.container` is `@asheeui/core`'s — the maximum width, the gutter and the
 * centring are declared once, for both platforms, in
 * `packages/core/src/components/layouts/container/container-config.ts`. This module keeps what is the
 * web's: the defaults it registers and the hard fallbacks it states.
 */

import type { ContainerConfig } from "@asheeui/core";
import { registerComponentDefaults } from "@asheeui/core";

/**
 * The shared width vocabulary, re-exported so code that already reaches for it here keeps working.
 * The type itself is declared in `@asheeui/core`, so a band and a container name one type on both
 * platforms.
 */
export type { ContainerConfig, ContainerSize } from "@asheeui/core";

/**
 * Default config values registered for the Container component.
 */
export const defaultContainerConfig: ContainerConfig = {
  size: "lg",
  gutter: true,
  centered: true,
};

registerComponentDefaults("container", defaultContainerConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_CONTAINER_CONFIG = {
  size: "lg",
  gutter: true,
  centered: true,
} satisfies ContainerConfig;
