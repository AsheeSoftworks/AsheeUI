/**
 * The clipboard pair's configuration face, shared by both platforms.
 *
 * `Clipboard` copies a value and reports the result through a render function, and
 * `CopyButton` is the framework's own control built on it. Both answer the same questions —
 * how long the copied state lasts, what the control is called before and after a copy, and
 * how it is dressed — so those questions are named here, once, and `components.clipboard`
 * means the same thing in a web application and in a native one.
 *
 * The module registers nothing and imports no renderer. Its side effect is a type
 * augmentation: declaring `clipboard` here is what makes `components.clipboard` a known
 * configuration section, on every platform, without each renderer restating it.
 */

import type { Radius, Size } from "../../shared/radius";
import type { Color, Variant } from "../../shared/variant";

/**
 * Theme configuration options for the clipboard components.
 *
 * Set under `components.clipboard` in the AsheeUI config. Values feed the
 * component-level fallback tier of the theme cascade.
 */
export interface ClipboardConfig {
  /**
   * How long the copied state lasts, in milliseconds.
   *
   * @default 2000
   */
  timeout?: number;

  /** Name of the copy control. @default "Copy" */
  label?: string;

  /** Name of the copy control once the text is on the clipboard.
   * @default "Copied" */
  copiedLabel?: string;

  /** Visual style of the copy control. @default "bordered" */
  variant?: Variant;

  /** Accent colour of the copy control. @default "primary" */
  color?: Color;

  /** Density of the copy control. @default "sm" */
  size?: Size;

  /** Corner rounding of the copy control. Defaults to the framework radius. */
  radius?: Radius;
}

declare module "../../registry" {
  interface ComponentTypeConfigRegistry {
    clipboard: ClipboardConfig;
  }
}
