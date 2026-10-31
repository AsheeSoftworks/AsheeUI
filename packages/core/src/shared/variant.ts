/**
 * The variant and colour vocabulary both renderers share.
 *
 * A variant is how a control is drawn and a colour is which role it wears — the framework's words,
 * the same two on either platform, which is why the unions live in core. The style maps that turned
 * them into classes were web's, and moved to `@asheeui/web` in C2; the platform maps its own.
 */

/**
 * The available visual styles for components like Button.
 * Each variant represents a distinct visual treatment with different
 * background, border, and hover behaviors.
 */
export type Variant = "solid" | "ghost" | "bordered" | "faded" | "underlined";

/**
 * The available color options for themed components.
 * "none" represents a neutral or default color treatment.
 */
export type Color =
  | "none"
  | "primary"
  | "secondary"
  | "danger"
  | "warning"
  | "success";
