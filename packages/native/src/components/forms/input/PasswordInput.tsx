/**
 * PasswordInput component for the native package.
 *
 * The component satisfies the framework's password-field contract: the same props as the
 * web `PasswordInput`, the same reveal control with the same two icons and the same
 * `toggleAriaLabel`, implemented with the platform's secure text entry.
 *
 * The security is not a presentation detail: `type="password"` is what makes the field
 * `secureTextEntry`, and the reveal control is what removes it. A password field that
 * rendered as ordinary text because the platform had no `type` attribute is the defect this
 * component exists to prevent, so the masking is asserted through `secureTextEntry` rather
 * than through a style.
 *
 * The default icons are words rather than drawings, because this package ships no icon set
 * and a glyph that depends on the platform's font is not a reliable affordance. A consumer
 * who has icons passes `onIcon` and `offIcon`, and they replace the words.
 */

import { type ReactNode, useState } from "react";
import { Pressable } from "react-native";
import { Typography } from "../../typography/text/Text";
import { Input, type InputProps } from "./Input";

/**
 * Props for the native PasswordInput.
 *
 * It is the Input's props without `type` and `endContent`, because this component owns both:
 * the type is what the reveal control switches, and the end slot is where the control sits.
 */
export interface PasswordInputProps
  extends Omit<InputProps, "type" | "endContent"> {
  /**
   * The accessible name of the reveal control, as a function of the current visibility.
   *
   * Receives the state the control is in and returns the label it should announce, so a
   * consumer can say "Show password" / "Hide password" in its own words.
   */
  toggleAriaLabel?: (show: boolean) => string;

  /** The icon shown while the password is hidden. */
  offIcon?: ReactNode;

  /** The icon shown while the password is visible. */
  onIcon?: ReactNode;
}

/**
 * A password field with a reveal control.
 *
 * @param props - The field's options.
 * @param props.toggleAriaLabel - The reveal control's accessible name.
 * @param props.offIcon - The icon shown while hidden.
 * @param props.onIcon - The icon shown while visible.
 * @returns The rendered field.
 *
 * @example
 * ```tsx
 * <PasswordInput
 *   label="Password"
 *   toggleAriaLabel={(show) => (show ? "Hide password" : "Show password")}
 * />
 * ```
 *
 * @see Input - The field this one composes.
 */
export function PasswordInput({
  toggleAriaLabel,
  offIcon,
  onIcon,
  isDisabled,
  ...rest
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  const label = toggleAriaLabel
    ? toggleAriaLabel(isVisible)
    : isVisible
      ? "Hide password"
      : "Show password";

  return (
    <Input
      {...rest}
      isDisabled={isDisabled}
      // The reveal is exactly the switch between the two entry modes: masked is the
      // platform's secure entry, and showing it is plain text. The `type` prop is the
      // public vocabulary for that, so the control states the type rather than poking at
      // `secureTextEntry` behind the Input's back.
      type={isVisible ? "text" : "password"}
      autoComplete="current-password"
      endContent={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          // The control reports whether the password is currently visible, which is what
          // `aria-pressed` states on the web; the platform's nearest state is `selected`.
          accessibilityState={{
            selected: isVisible,
            disabled: Boolean(isDisabled),
          }}
          disabled={isDisabled}
          onPress={() => setIsVisible((visible) => !visible)}
          hitSlop={8}
          className="p-1">
          {isVisible ? (
            (offIcon ?? <Typography role="label">Hide</Typography>)
          ) : (
            (onIcon ?? <Typography role="label">Show</Typography>)
          )}
        </Pressable>
      }
    />
  );
}
