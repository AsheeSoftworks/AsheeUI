/**
 * The Alert's configuration face, shared by both platforms.
 *
 * An alert is an inline message, and both platforms ask it the same three
 * questions: how urgent it is, how it is drawn, and how round its corners are.
 * Those three are named here, once, so `components.alert` is configured the same
 * way in a web application and in a native one, and so a renderer that forgets one
 * of them fails to compile rather than quietly ignoring it.
 *
 * What an intent *means* is stated alongside them rather than in each renderer,
 * because it is not a rendering detail: the colour role it takes, and whether it
 * interrupts what assistive technology is reading or waits for a pause. The web
 * announces through a live region and native through its own accessibility role,
 * but which intents interrupt is one decision, and it lives in the class
 * dictionaries both renderers read.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `alert` here is what makes `components.alert` a known
 * configuration section without either renderer restating it.
 */

import type { Radius } from "../../shared/radius";
import type { Variant } from "../../shared/variant";

/**
 * Intent of an alert.
 *
 * Selects the colour an alert is presented in and how urgently it is announced:
 * `error` and `warning` interrupt, `info` and `success` wait for a pause in what
 * assistive technology is reading.
 */
export type AlertType = "success" | "error" | "info" | "warning";

/**
 * Configuration options for the Alert.
 *
 * Set under `components.alert` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface AlertConfig {
  /**
   * Intent of the alert.
   * Controls its colour and how urgently its message is announced.
   *
   * @default "info"
   */
  type?: AlertType;

  /**
   * Visual style variant.
   * An alert has no underline treatment, so the union for this option is the
   * four treatments a message surface can wear.
   *
   * @default "faded"
   */
  variant?: Exclude<Variant, "underlined">;

  /**
   * Corner rounding.
   *
   * @default "md"
   */
  radius?: Radius;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    alert: AlertConfig;
  }
}
