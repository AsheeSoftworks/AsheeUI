/**
 * PasswordInput component for AsheeUI.
 * This file provides the PasswordInput component, which extends the Input
 * component with a toggleable password visibility feature. It renders an
 * input field with a button that toggles between showing and hiding the
 * password text.
 */
"use client";

import { forwardRef, type ReactNode, useState } from "react";
import { EyeIcon } from "../../icons/EyeIcon";
import { EyeOffIcon } from "../../icons/EyeOffIcon";
import { cn } from "../../utils";
import { Input, type InputProps } from "./Input";

/**
 * Configuration options for the PasswordInput component.
 */
export interface PasswordInputProps
  extends Omit<InputProps, "type" | "endContent"> {
  /**
   * Function that returns the aria-label for the toggle button.
   * Receives the current visibility state and returns a label string.
   */
  toggleAriaLabel?: (show: boolean) => string;

  /**
   * Icon shown when password is hidden (show button).
   * Defaults to EyeIcon.
   */
  offIcon?: ReactNode;

  /**
   * Icon shown when password is visible (hide button).
   * Defaults to EyeOffIcon.
   */
  onIcon?: ReactNode;
}

/**
 * A password input field with a toggleable visibility button.
 *
 * PasswordInput extends the Input component with a built-in toggle
 * button that shows or hides the password text. It manages its own
 * visibility state and provides appropriate aria-label handling for
 * accessibility.
 *
 * @param props - PasswordInput configuration options.
 * @param props.disabled - Whether the input is disabled.
 * @param props.className - Extra CSS classes for the input.
 * @param props.toggleAriaLabel - Function for toggle button aria-label.
 * @param props.offIcon - Icon shown when password is hidden.
 * @param props.onIcon - Icon shown when password is visible.
 * @param props.autoComplete - Autocomplete attribute. Defaults to "current-password".
 *
 * @example
 * ```tsx
 * import { PasswordInput } from "asheeui";
 *
 * export function Example() {
 *   return (
 *     <PasswordInput
 *       label="Password"
 *       placeholder="Enter your password"
 *       required
 *     />
 *   );
 * }
 * ```
 *
 * @see Input - The base input component.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      disabled,
      className,
      toggleAriaLabel,
      offIcon,
      onIcon,
      autoComplete = "current-password",
      ...rest
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <Input
        ref={ref}
        type={showPassword ? "text" : "password"}
        disabled={disabled}
        autoComplete={autoComplete}
        className={cn("pr-10", className)}
        endContent={
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={
              toggleAriaLabel
                ? toggleAriaLabel(showPassword)
                : showPassword
                  ? "Hide password"
                  : "Show password"
            }
            className={cn(
              "p-1 rounded text-foreground/70 hover:text-foreground transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              disabled && "pointer-events-none opacity-50",
            )}>
            {showPassword
              ? (offIcon ?? <EyeOffIcon />)
              : (onIcon ?? <EyeIcon />)}
          </button>
        }
        {...rest}
      />
    );
  },
);

PasswordInput.displayName = "PasswordInput";
