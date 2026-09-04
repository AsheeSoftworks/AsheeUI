"use client";

import { type RefObject, useCallback, useContext } from "react";
import { KeyboardContext, type KeyboardElement } from "./keyboard-context";

export function useKeyboardField(
  id: string,
  ref?: RefObject<KeyboardElement | null>,
  enabled: boolean = false, // Set default to false (opt-in) or true
) {
  const keyboard = useContext(KeyboardContext);

  const handleFocus = useCallback(
    (e?: React.FocusEvent<KeyboardElement>) => {
      if (!enabled || !keyboard) return;
      const element = e?.currentTarget ?? ref?.current;
      if (element) {
        keyboard.openKeyboard(id, element);
      }
    },
    [id, ref, enabled, keyboard],
  );

  const handleBlur = useCallback(() => {
    if (!enabled || !keyboard) return;
    keyboard.requestClose(id);
  }, [id, enabled, keyboard]);

  return {
    handleFocus,
    handleBlur,
    hasProvider: Boolean(keyboard),
  };
}
