/**
 * Component contracts for AsheeUI.
 *
 * A contract is the part of a component that both platforms agree on: the prop
 * names, the values they accept, which props are required, and what the component
 * means by them. It deliberately says nothing about how the component is built, so
 * a web component and a native component can satisfy the same contract with
 * completely different implementations.
 *
 * The contracts are types rather than components because the framework's promise
 * is a contract, not shared source. A component's implementation is free to be
 * exactly what its platform needs.
 */

import type { ColorRole, Radius, Size, Space, Variant } from "./tokens";

/**
 * The visual axes every themed component may offer.
 * A component that does not support an axis simply does not declare it.
 */
export interface ThemedContract {
  /** Visual treatment. */
  variant?: Variant | undefined;

  /** Semantic colour role. */
  color?: ColorRole | undefined;

  /** Density. */
  size?: Size | undefined;

  /** Corner rounding. */
  radius?: Radius | undefined;
}

/**
 * The contract of a text component.
 */
export interface TextContract {
  /** The text to render. */
  children?: string | undefined;

  /** Semantic typography role, which resolves size, weight, leading and tracking. */
  role?:
    | "display"
    | "heading-xl"
    | "heading-lg"
    | "heading-md"
    | "heading-sm"
    | "body-lg"
    | "body-md"
    | "body-sm"
    | "label"
    | "caption"
    | "overline";

  /** Semantic colour role for the text. */
  tone?: ColorRole | "muted" | "default" | undefined;

  /** Horizontal alignment. */
  align?: "left" | "center" | "right" | undefined;

  /** Whether to truncate instead of wrapping. */
  truncate?: boolean | undefined;
}

/**
 * The contract of a button.
 */
export interface ButtonContract extends ThemedContract {
  /** The button's visible label, and its accessible name. */
  children?: string | undefined;

  /** Whether the button stretches to its container's width. */
  fullWidth?: boolean | undefined;

  /** Whether the button is disabled. */
  isDisabled?: boolean | undefined;

  /** Whether the button shows a pending state and blocks interaction. */
  isLoading?: boolean | undefined;

  /** Called when the button is activated. */
  onPress?: (() => void) | undefined;
}

/**
 * The contract of a card.
 */
export interface CardContract extends ThemedContract {
  /** The card's title. */
  title?: string | undefined;

  /** The card's supporting text. */
  description?: string | undefined;

  /** Content rendered before the title, typically an accent element. */
  header?: React.ReactNode | undefined;

  /** Content rendered after the body, typically actions. */
  footer?: React.ReactNode | undefined;

  /** Whether the whole card is interactive. */
  isPressable?: boolean | undefined;
}

/**
 * The contract of a layout container that stacks its children on one axis.
 */
export interface StackContract {
  /** The axis the children are laid out along. */
  direction?: "row" | "column" | undefined;

  /** Space between children, from the shared spacing scale. */
  gap?: Space | undefined;

  /** Cross-axis alignment of the children. */
  align?: "start" | "center" | "end" | "stretch" | undefined;

  /** Main-axis distribution of the children, where the platform supports it. */
  justify?: "start" | "center" | "end" | "between" | undefined;

  /** Whether children wrap onto another line. */
  wrap?: boolean | undefined;
}

/**
 * The contract of a compact status label.
 */
export interface BadgeContract extends ThemedContract {
  /** The label's text. */
  children?: string | undefined;
}

/**
 * The contract of a text field.
 */
export interface InputContract extends ThemedContract {
  /** The field's label. */
  label?: string | undefined;

  /** The current value, for a consumer that owns it. */
  value?: string | undefined;

  /** The initial value, for a consumer that does not. */
  defaultValue?: string | undefined;

  /** Called with the next value whenever it changes. */
  onChangeText?: ((value: string) => void) | undefined;

  /** Hint text shown while the field is empty. */
  placeholder?: string | undefined;

  /** Description shown under the label. */
  description?: string | undefined;

  /** Validation message shown under the field. */
  message?: string | undefined;

  /** Validation status, which selects the message's tone. */
  status?: "default" | "error" | "warning" | "success" | undefined;

  /** Whether the field is disabled. */
  isDisabled?: boolean | undefined;

  /** Whether the field accepts several lines. */
  multiline?: boolean | undefined;
}
