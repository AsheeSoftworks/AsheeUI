/**
 * The Section's configuration section, shared by both platforms.
 *
 * Vertical rhythm, the background treatment, the optional container and the divider are the
 * framework's questions about a band of a page, so `components.section` means one thing on both
 * platforms and each renderer keeps only the values it lands on — the platform's spacing baseline is
 * its own, and its section paints the theme's background where the web's shows the page through.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type augmentation:
 * declaring `section` here is what makes `components.section` a known configuration section on every
 * platform, without each renderer restating it.
 */

import type {
  ContainerSize,
  SectionBackground,
} from "../../../shared/section-block";
import type { Space } from "../../../shared/spacing";

/**
 * Background treatment of a section.
 *
 * - `none`: transparent, so the page background shows through.
 * - `muted`: a subdued band, used to separate one section from the next.
 * - `tinted`: a faint accent band, used to emphasise a section.
 */
export type { SectionBackground };

/**
 * Theme configuration options for the Section component.
 *
 * Set under `components.section` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface SectionConfig {
  /**
   * Vertical padding of the section.
   *
   * @default "lg"
   */
  spacing?: Space | undefined;

  /**
   * Background treatment.
   *
   * @default "none"
   */
  background?: SectionBackground | undefined;

  /**
   * Whether the section wraps its children in a container.
   * Off by default, so a section can be composed with any other layout
   * element. On, the section owns the maximum width and the gutter.
   *
   * @default false
   */
  contained?: boolean | undefined;

  /**
   * Maximum content width used when the section is contained.
   *
   * @default "lg"
   */
  containerSize?: ContainerSize | undefined;

  /**
   * Whether to draw a separator line above the section.
   *
   * @default false
   */
  divider?: boolean | undefined;
}

declare module "../../../registry" {
  interface ComponentTypeConfigRegistry {
    section: SectionConfig;
  }
}
