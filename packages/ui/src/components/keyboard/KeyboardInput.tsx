"use client";

import { cn } from "@asheeui/utils";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Input, type InputProps } from "../input";
import { useKeyboard } from "./keyboard-context";
import { useKeyboardField } from "./use-keyboard-field";

export interface KeyboardInputProps
  extends Omit<InputProps, "value" | "onChange" | "onFocus" | "onBlur"> {
  name: string;
}

export const KeyboardInput = forwardRef<HTMLInputElement, KeyboardInputProps>(
  ({ name, className, ...props }, externalRef) => {
    const { inputs } = useKeyboard();
    const internalRef = useRef<HTMLInputElement>(null);

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
      <Input
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
