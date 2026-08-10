"use client";

import { cn } from "@ashee/utils";
import {
  forwardRef,
  type InputHTMLAttributes,
  useImperativeHandle,
  useRef,
} from "react";
import { useKeyboard } from "./keyboard-context";
import { useKeyboardField } from "./use-keyboard-field";

export interface KeyboardInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export const KeyboardInput = forwardRef<HTMLInputElement, KeyboardInputProps>(
  ({ name, className, ...props }, externalRef) => {
    const { inputs } = useKeyboard();
    const internalRef = useRef<HTMLInputElement | null>(null);

    useImperativeHandle(
      externalRef,
      () => internalRef.current as HTMLInputElement,
    );

    const { handleFocus, handleBlur, handleChange } = useKeyboardField(
      name,
      internalRef,
    );

    const value = inputs[name] ?? "";

    return (
      <input
        {...props}
        ref={internalRef}
        name={name}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoComplete="off"
        className={cn(
          "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors",
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          className,
        )}
      />
    );
  },
);

KeyboardInput.displayName = "KeyboardInput";
