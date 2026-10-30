/**
 * The Centered primitive's configuration section, shared by both platforms.
 *
 * What a block is centred on, how much room it claims before centring, and whether it is held in a
 * {@link Container} are the framework's questions, not a renderer's, so `components.centered` means
 * one thing on both platforms and each renderer keeps only the values it lands on.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type augmentation:
 * declaring `centered` here is what makes `components.centered` a known configuration section on
 * every platform, without each renderer restating it.
 */

import type { Space } from "../../../shared/spacing";
import type { ContainerSize } from "../../../shared/section-block";

/**
 * The axes a Centered block can centre on.
 *
 * - `both`: centres horizontally and vertically, the arrangement a sign-in card
 *   or an empty page wants. It also centres the block's text (`text-center`),
 *   because a block centred on both axes is almost always a short statement; the
 *   other two axes leave the text alignment alone.
 * - `horizontal`: centres sideways only, for a heading or a single control.
 * - `vertical`: centres vertically only, when the block's own width is intended.
 */
export type CenteredAxis = "both" | "horizontal" | "vertical";

/**
 * Theme configuration options for the Centered component.
 *
 * Set under `components.centered` in the AsheeUI config. Values feed the
 * component-level tier of the theme cascade.
 */
export interface CenteredConfig {
  /**
   * The axis the content is centred on.
   *
   * `both` also applies `text-center`; `horizontal` and `vertical` centre the box
   * only and leave the text alignment to the content.
   *
   * @default "both"
   */
  axis?: CenteredAxis | undefined;

  /**
   * Vertical room the block reserves before centring.
   * A block that is as tall as its content cannot be centred vertically, so a
   * consumer chooses how much height the block claims.
   *
   * @default "none"
   */
  minHeight?: Space | undefined;

  /**
   * Whether the content is held in a container.
   * Use it when the centred content is a whole page region rather than a single
   * control, so the content keeps a readable maximum width.
   *
   * The platform's centered block has no container of its own, so the option is accepted there and
   * states nothing.
   *
   * @default false
   */
  contained?: boolean | undefined;

  /**
   * Maximum content width when `contained` is on.
   *
   * @default "lg"
   */
  containerSize?: ContainerSize | undefined;
}

declare module "../../../registry" {
  interface ComponentTypeConfigRegistry {
    centered: CenteredConfig;
  }
}
