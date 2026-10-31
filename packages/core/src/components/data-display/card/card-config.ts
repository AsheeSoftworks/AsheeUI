/**
 * The Card's configuration face, shared by both platforms.
 *
 * A card is a surface with content in it, and the questions a consumer asks about it are the
 * framework's rather than a renderer's: which treatment, which density, which corner, where the
 * image sits, and whether the whole surface is a control. `components.card` therefore means one
 * thing on both platforms; each renderer keeps only the *values* it lands on — the image a web card
 * lays out, the accent a device draws on its border.
 *
 * The treatment vocabulary is wider than either renderer's surface vocabulary, on purpose. The
 * framework names five treatments; the web card draws four surfaces and owns two names of its own
 * (`elevated`, `flat`), and the platform card draws all five. So `CardVariant` states the seven names
 * a consumer may write, and `@asheeui/core`'s {@link resolveCardVariant} is the rule that lands any of
 * them on a treatment each renderer can draw.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type augmentation:
 * declaring `card` here is what makes `components.card` a known configuration section on every
 * platform, without each renderer restating it.
 */

import type { Radius, Size } from "../../../shared/radius";
import type { Color, Variant } from "../../../shared/variant";
import type { ImageFit, ImageRatioKey } from "../image/image-config";

/**
 * A visual treatment a card may be configured with.
 *
 * The five the framework names, plus the web card's own two surface names. `elevated` and `flat` are
 * surfaces rather than treatments — a device has no shadow to raise and no flat/pressed distinction
 * to draw — so `resolveCardVariant` maps both onto `solid`, which is the fill each renderer draws for
 * them.
 */
export type CardVariant = Variant | "elevated" | "flat";

/**
 * Placement of the card image relative to the content.
 * "top" and "bottom" place the image above or below the content.
 * "background" places the image as a full-bleed background layer.
 */
export type CardImagePosition = "top" | "bottom" | "background";

/**
 * Loading strategy of the card image.
 * Controls when the browser loads the image resource; a device ignores it.
 */
export type CardImageLoading = "lazy" | "eager";

/**
 * Configuration options for the card image.
 *
 * The *placement* is shared, because where an image sits in a card is a design decision. The three
 * options under it are the web's: a device lays an image out through its own component, so `ratio`,
 * `fit` and `loading` are accepted here and drawn by the renderer that can.
 */
export interface CardImageConfig {
  /**
   * Placement of the card image.
   * Determines where the image appears relative to the content.
   *
   * @default "top"
   */
  position?: CardImagePosition | undefined;

  /**
   * Aspect ratio of the positioned image.
   * Controls the proportional dimensions of the image container.
   * Common values: "video" (16:9), "square" (1:1), "portrait" (3:4).
   *
   * @default "video"
   */
  ratio?: ImageRatioKey | undefined;

  /**
   * Object-fit strategy of the positioned image.
   * Controls how the image fills its container.
   *
   * - `cover`: Scales the image to cover the container, cropping if necessary.
   * - `contain`: Scales the image to fit within the container.
   * - `fill`: Stretches the image to fill the container.
   *
   * @default "cover"
   */
  fit?: ImageFit | undefined;

  /**
   * Loading strategy of the positioned image.
   * `lazy` defers loading until the image is near the viewport.
   * `eager` loads the image immediately.
   *
   * @default "lazy"
   */
  loading?: CardImageLoading | undefined;
}

/**
 * Theme configuration options for the Card component.
 *
 * Set under `components.card` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface CardConfig {
  /**
   * Visual treatment of the surface.
   *
   * The card's own four surfaces are always expressible, and so is the framework's five-name
   * treatment vocabulary: a value the card cannot draw resolves to the nearest surface it can — see
   * {@link resolveCardVariant}.
   *
   * @default "bordered"
   */
  variant?: CardVariant | undefined;

  /**
   * Accent colour of the surface.
   *
   * The platform draws it as the border's accent. The web card's treatment decides its own colour,
   * so this option is accepted there and drawn by the renderer that has an accent to paint.
   *
   * @default "primary"
   */
  color?: Color | undefined;

  /**
   * Content padding and spacing scale.
   * Controls the density of the card's internal spacing.
   * Larger values provide more padding and gap between elements.
   *
   * @default "md"
   */
  size?: Size | undefined;

  /**
   * Corner rounding.
   * Controls the border-radius of the card.
   *
   * @default "md"
   */
  radius?: Radius | undefined;

  /**
   * Enables the press animation when clickable.
   * When true, the card scales down slightly on click for tactile feedback. The platform's own
   * `Pressable` supplies the same feedback, so the option is accepted there and states nothing.
   *
   * @default true
   */
  animate?: boolean | undefined;

  /**
   * Whether the whole card responds to a press.
   *
   * A device's card is a surface rather than a control until this is on. The web card is pressable
   * through its own `onClick`, so the option is accepted there and states nothing.
   *
   * @default false
   */
  isPressable?: boolean | undefined;

  /**
   * Image configuration for the card.
   * Controls the placement, aspect ratio, fit, and loading behavior
   * of the card's image.
   *
   * Optional because a configuration is a partial override: a consumer states
   * `components.card.size` and nothing else, and the image options then resolve
   * from the registered defaults. A consumer that writes the object as JSON can
   * also set `image: null` to state "no image options at all", so a renderer
   * must read this tier defensively rather than assume the object is present.
   */
  image?: CardImageConfig | undefined;
}

declare module "../../../registry" {
  interface ComponentTypeConfigRegistry {
    card: CardConfig;
  }
}
