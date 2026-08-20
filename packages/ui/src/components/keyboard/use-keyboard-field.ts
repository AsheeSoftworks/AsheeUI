"use client";

import { type RefObject, useCallback, useEffect } from "react";

import { type KeyboardElement, useKeyboard } from "./keyboard-context";

export function useKeyboardField(
  name: string,
  ref: RefObject<KeyboardElement | null>,
) {
  const { openKeyboard, requestClose, setInput, registerField } = useKeyboard();

  useEffect(() => {
    registerField(name, ref.current);
    return () => {
      registerField(name, null);
    };
  }, [name, ref, registerField]);

  const handleFocus = useCallback(() => {
    openKeyboard(name);
  }, [name, openKeyboard]);

  const handleBlur = useCallback(() => {
    requestClose(name);
  }, [name, requestClose]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput(name, e.target.value);
    },
    [name, setInput],
  );

  return {
    handleFocus,
    handleBlur,
    handleChange,
  };
}
