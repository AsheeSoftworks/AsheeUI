/**
 * The Image's configuration face, shared by both platforms.
 *
 * The option names, the values they accept and their meaning are the part of the Image
 * both renderers agree on, so a consumer configures `components.image` once and both
 * platforms read the same keys. What a renderer keeps for itself is the value each
 * option defaults to, because that is a platform property.
 *
 * One option is the web's alone, and it is named rather than hidden: `loading` asks the
 * *browser* when to fetch a picture. A native picture is a view, so it is fetched when
 * the view mounts, and a native list fetches a row when it scrolls into view — the
 * platform supplies the laziness the web option states. Because a native renderer
 * cannot act on the option at all, it excludes it from its own configuration type
 * rather than accepting a value it would ignore.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `image` here is what makes `components.image` a known
 * configuration section, on every platform, without each renderer restating it.
 */

import type { Radius } from "../../shared/radius";

/**
 * Object-fit behaviour of the image inside its ratio box.
 *
 * - `cover`: Scales to fill, cropping overflow.
 * - `contain`: Scales to fit entirely inside.
 * - `fill`: Stretches to fill, ignoring aspect ratio.
 * - `none`: Natural size, no scaling.
 * - `scale-down`: Smallest of `none` and `contain`.
 */
export type ImageFit = "cover" | "contain" | "fill" | "none" | "scale-down";

/**
 * Aspect ratio applied to the image container.
 *
 * - `auto`: Uses the image's intrinsic ratio.
 * - `square`: 1 / 1.
 * - `video`: 16 / 9.
 * - `portrait`: 4 / 5.
 */
export type ImageRatioKey = "auto" | "square" | "video" | "portrait";

/**
 * When the browser is asked to fetch the picture.
 * It is the web's option; see the note above for why native does not carry it.
 */
export type ImageLoading = "lazy" | "eager";

/**
 * Theme configuration options for the Image component.
 *
 * Set under `components.image` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface ImageConfig {
  /**
   * Object-fit strategy.
   * Controls how the image fills its container.
   *
   * @default "cover"
   */
  fit?: ImageFit;

  /**
   * Container aspect ratio.
   * Controls the proportional dimensions of the image container.
   *
   * @default "auto"
   */
  ratio?: ImageRatioKey;

  /**
   * Corner rounding.
   * Controls the border-radius of the image container.
   *
   * @default "md"
   */
  radius?: Radius;

  /**
   * Native image loading strategy.
   * Controls when the browser loads the image resource.
   *
   * @default "lazy"
   */
  loading?: ImageLoading;

  /**
   * Shows a shimmering placeholder until the image loads.
   * Displays a subtle loading animation while the image is loading.
   *
   * @default true
   */
  showSkeleton?: boolean;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    image: ImageConfig;
  }
}
