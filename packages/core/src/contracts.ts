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
  variant?: Variant;

  /** Semantic colour role. */
  color?: ColorRole;

  /** Density. */
  size?: Size;

  /** Corner rounding. */
  radius?: Radius;
}

/**
 * The contract of a text component.
 */
export interface TextContract {
  /** The text to render. */
  children?: string;

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
  tone?: ColorRole | "muted" | "default";

  /** Horizontal alignment. */
  align?: "left" | "center" | "right";

  /** Whether to truncate instead of wrapping. */
  truncate?: boolean;
}

/**
 * The contract of a button.
 */
export interface ButtonContract extends ThemedContract {
  /** The button's visible label, and its accessible name. */
  children?: string;

  /** Whether the button stretches to its container's width. */
  fullWidth?: boolean;

  /** Whether the button is disabled. */
  isDisabled?: boolean;

  /** Whether the button shows a pending state and blocks interaction. */
  isLoading?: boolean;

  /** Called when the button is activated. */
  onPress?: () => void;
}

/**
 * The contract of a card.
 */
export interface CardContract extends ThemedContract {
  /** The card's title. */
  title?: string;

  /** The card's supporting text. */
  description?: string;

  /** Content rendered before the title, typically an accent element. */
  header?: React.ReactNode;

  /** Content rendered after the body, typically actions. */
  footer?: React.ReactNode;

  /** Whether the whole card is interactive. */
  isPressable?: boolean;
}

/**
 * The contract of a layout container that stacks its children on one axis.
 */
export interface StackContract {
  /** The axis the children are laid out along. */
  direction?: "row" | "column";

  /** Space between children, from the shared spacing scale. */
  gap?: Space;

  /** Cross-axis alignment of the children. */
  align?: "start" | "center" | "end" | "stretch";

  /** Main-axis distribution of the children, where the platform supports it. */
  justify?: "start" | "center" | "end" | "between";

  /** Whether children wrap onto another line. */
  wrap?: boolean;
}

/**
 * The contract of a compact status label.
 */
export interface BadgeContract extends ThemedContract {
  /** The label's text. */
  children?: string;
}

/**
 * The contract of a text field.
 */
export interface InputContract extends ThemedContract {
  /** The field's label. */
  label?: string;

  /** The current value, for a consumer that owns it. */
  value?: string;

  /** The initial value, for a consumer that does not. */
  defaultValue?: string;

  /** Called with the next value whenever it changes. */
  onChangeText?: (value: string) => void;

  /** Hint text shown while the field is empty. */
  placeholder?: string;

  /** Description shown under the label. */
  description?: string;

  /** Validation message shown under the field. */
  message?: string;

  /** Validation status, which selects the message's tone. */
  status?: "default" | "error" | "warning" | "success";

  /** Whether the field is disabled. */
  isDisabled?: boolean;

  /** Whether the field accepts several lines. */
  multiline?: boolean;
}
