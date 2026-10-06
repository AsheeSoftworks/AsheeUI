/**
 * The CTA's configuration face, shared by both platforms.
 *
 * A call to action is the band a page ends on: one statement, one or two configured actions,
 * and optionally a panel that lifts it off the page. Both platforms ask it the band options
 * every band shares (stated once in `shared/section-block`) and one question of its own: how
 * its panel is drawn. It deliberately does not own a form — a consumer that wants an email
 * field in the band places its own controls in the band's children, so the framework never
 * couples a layout pattern to an application's subscription flow.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `cta` here is what makes `components.cta` a known configuration
 * section without either renderer restating it.
 */

import type { SectionBlockOptions } from "../../shared/section-block";

/**
 * Visual treatment of the call to action's panel.
 *
 * - `bordered`: a bordered surface on the page background.
 * - `muted`: a subdued surface without a border.
 * - `plain`: no panel, so the actions sit directly on the band.
 */
export type CtaPanel = "bordered" | "muted" | "plain";

/**
 * Configuration options for the CTA.
 *
 * Set under `components.cta` in the AsheeUI config. Values feed the component-level fallback
 * tier of the theme cascade.
 */
export interface CtaConfig extends SectionBlockOptions {
  /** Panel treatment. */
  panel?: CtaPanel;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    cta: CtaConfig;
  }
}
