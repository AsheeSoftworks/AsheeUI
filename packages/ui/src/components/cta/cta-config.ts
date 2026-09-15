/**
 * CTA component configuration for AsheeUI.
 * This file defines the configuration type and defaults for the CTA pattern:
 * alignment, vertical rhythm, background treatment, panel treatment and content
 * width. It registers the default configuration with the component registry and
 * provides fallback values for the cascade resolution system.
 */

import { registerComponentDefaults } from "../../libs/registry";
import type { Space } from "../../shared";
import type { ContainerSize } from "../container/container-config";
import type { SectionBackground } from "../section/section-config";

/**
 * Visual treatment of the call to action panel.
 *
 * - `bordered`: a bordered surface on the page background.
 * - `muted`: a subdued surface without a border.
 * - `plain`: no panel, so the actions sit directly on the band.
 */
export type CtaPanel = "bordered" | "muted" | "plain";

/**
 * Theme configuration options for the CTA component.
 *
 * Set under `components.cta` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface CtaConfig {
  /**
   * Alignment of the panel content.
   *
   * @default "center"
   */
  align?: "start" | "center";

  /**
   * Vertical padding of the band.
   *
   * @default "lg"
   */
  spacing?: Space;

  /**
   * Background treatment of the band.
   *
   * @default "none"
   */
  background?: SectionBackground;

  /**
   * Panel treatment.
   *
   * @default "bordered"
   */
  panel?: CtaPanel;

  /**
   * Maximum content width of the band.
   *
   * @default "lg"
   */
  containerSize?: ContainerSize;

  /**
   * Whether the band wraps its content in a {@link Container}.
   *
   * @default true
   */
  contained?: boolean;
}

/**
 * Default config values registered for the CTA component.
 */
export const defaultCtaConfig: CtaConfig = {
  align: "center",
  spacing: "lg",
  background: "none",
  panel: "bordered",
  containerSize: "lg",
  contained: true,
};

declare module "../../libs/registry" {
  interface ComponentTypeConfigRegistry {
    cta: CtaConfig;
  }
}

registerComponentDefaults("cta", defaultCtaConfig);

/**
 * Hard fallback values used when no config tier provides a value.
 */
export const FALLBACK_CTA_CONFIG: Required<CtaConfig> = {
  align: "center",
  spacing: "lg",
  background: "none",
  panel: "bordered",
  containerSize: "lg",
  contained: true,
};
