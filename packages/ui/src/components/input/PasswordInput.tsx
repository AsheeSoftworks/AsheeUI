"use client";

import { cn } from "@asheeui/utils";
import { forwardRef, useState } from "react";
import { EyeIcon } from "../../icons/EyeIcon";
import { EyeOffIcon } from "../../icons/EyeOffIcon";
import { Input, type InputProps } from "./Input";

export interface PasswordInputProps extends Omit<InputProps, "type"> {
  toggleAriaLabel?: (show: boolean) => string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      disabled,
      className,
      toggleAriaLabel,
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
              "absolute right-3 p-1 rounded text-muted-foreground hover:text-foreground transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              disabled && "pointer-events-none opacity-50",
            )}>
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        }
        {...rest}
      />
    );
  },
);

PasswordInput.displayName = "PasswordInput";
