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
 *
 * What is left states a design axis (`ThemedContract`) and a field (`InputContract`). C4 deleted the
 * five that stated one component's props — `TextContract`, `ButtonContract`, `CardContract`,
 * `StackContract`, `BadgeContract` — because no file, test or tool read them: they described
 * components that already declare their props in their own config types, and a second statement of
 * the same props is a statement that can disagree with the shipped component.
 *
 * @deprecated B19 replaces this module with `PORTABLE_API`, and the prose above moves into that
 * module's documentation. It is kept here, rather than deleted with the five, only because B19 has
 * not landed yet: do not add a contract to it.
 */

import type { ColorRole, Radius, Size, Variant } from "./tokens";

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
