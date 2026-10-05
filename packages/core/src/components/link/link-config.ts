/**
 * The Link's configuration face, shared by both platforms.
 *
 * A link is a destination with a name, and both platforms ask it the same questions:
 * how much emphasis it carries, what colour it takes, how large it is, when it
 * underlines itself, and whether it points somewhere else. Those are named here, once,
 * so `components.link` means the same thing in a web application and in a native one.
 *
 * What a link *does* with the destination is the one thing that is not here: the web
 * renders an anchor and lets the browser follow it, and the platform hands the
 * destination to its own URL handler, which is what `openDestination` in
 * `@asheeui/native` is for. The vocabulary is shared; the mechanism is the platform's.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `link` here is what makes `components.link` a known
 * configuration section without either renderer restating it.
 */

import type { Size } from "../shared/radius";
import type { Color } from "../shared/variant";

/**
 * Visual style variant of the link.
 *
 * - `default`: the standard link, in its colour role.
 * - `muted`: a lower-contrast link, for navigation beside content.
 * - `subtle`: the lowest emphasis, for a link inside a sentence that is already quiet.
 */
export type LinkVariant = "default" | "muted" | "subtle";

/**
 * When a link shows its underline.
 *
 * - `always`: always underlined, which is what a link inside a run of text wants.
 * - `hover`: underlined while it is being pointed at, the platform's equivalent being
 *   while it is being pressed, because there is no pointer to hover with.
 * - `never`: never underlined, for a link that is already recognisable.
 */
export type LinkUnderline = "always" | "hover" | "never";

/**
 * Configuration options for the Link.
 *
 * Set under `components.link` in the AsheeUI config. Values feed the component-level
 * fallback tier of the theme cascade.
 */
export interface LinkConfig {
  /** Visual style variant. @default "default" */
  variant?: LinkVariant;

  /** Colour role of the text. @default "primary" */
  color?: Color;

  /** Density of the text and the icons beside it. @default "md" */
  size?: Size;

  /** When the underline is shown. @default "hover" */
  underline?: LinkUnderline;

  /**
   * Whether the link points to another resource.
   * A link that does says so: the web marks it with `target` and `rel` and shows the
   * external affordance, and the platform shows the same affordance.
   *
   * @default false
   */
  isExternal?: boolean;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    link: LinkConfig;
  }
}
