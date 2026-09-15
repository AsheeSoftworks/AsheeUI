/**
 * Footer component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the Footer pattern:
 * surface treatment, rhythm and nesting. It registers the default configuration
 * with the component registry and provides fallback values for the cascade
 * resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Space } from "../../shared";
import type { ContainerSize } from "../container/container-config";

/**
 * Surface treatment of the footer.
 *
 * - `solid`: the page background, so the footer reads as part of the page.
 * - `muted`: a subdued band.
 * - `bordered`: the page background with a separator above it.
 */
export type FooterVariant = "solid" | "muted" | "bordered";

/**
 * Theme configuration options for the Footer component.
 *
 * Set under `components.footer` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface FooterConfig {
  /** Surface treatment. @default "bordered" */
  variant?: FooterVariant;

  /** Vertical padding of the footer. @default "lg" */
  spacing?: Space;

  /** Whether the footer wraps its content in a `Container`. @default true */
  contained?: boolean;

  /** Maximum content width of the footer. @default "lg" */
  containerSize?: ContainerSize;
}

/**
 * Default config values registered for the Footer component.
 */
export const defaultFooterConfig: FooterConfig = {
  variant: "bordered",
  spacing: "lg",
  contained: true,
  containerSize: "lg",
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    footer: FooterConfig;
  }
}

registerComponentDefaults("footer", defaultFooterConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_FOOTER_CONFIG: Required<FooterConfig> = {
  variant: "bordered",
  spacing: "lg",
  contained: true,
  containerSize: "lg",
};
