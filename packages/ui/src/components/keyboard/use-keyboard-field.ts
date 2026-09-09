/**
 * Hook for connecting form inputs to the virtual keyboard.
 * This file provides the useKeyboardField hook that attaches focus and
 * blur handlers to input elements, triggering the on-screen keyboard
 * when the input is focused and requesting close on blur.
 */
"use client";

import { type RefObject, useCallback, useContext } from "react";
import {
  KeyboardContext,
  type KeyboardElement,
  type KeyboardOpenOptions,
} from "./KeyboardContext";

/**
 * Hook that connects a form input to the virtual keyboard system.
 *
 * useKeyboardField returns focus and blur handlers that should be passed
 * to an input element. When the input is focused, the keyboard opens.
 * When blurred, the keyboard closes after a configurable delay.
 *
 * @param id - The unique ID of the input element.
 * @param ref - Optional ref to the input element.
 * @param enabled - Whether the keyboard should be enabled for this field.
 *                  Defaults to false (opt-in behavior).
 * @param options - Optional configuration overrides for this field.
 * @returns An object containing handleFocus, handleBlur, and hasProvider.
 *
 * @example
 * ```tsx
 * import { useKeyboardField } from "asheeui";
 *
 * function MyInput() {
 *   const { handleFocus, handleBlur } = useKeyboardField(
 *     "my-input",
 *     inputRef,
 *     true,
 *     { layout: "numeric", size: "lg" }
 *   );
 *
 *   return (
 *     <input
 *       ref={inputRef}
 *       onFocus={handleFocus}
 *       onBlur={handleBlur}
 *     />
 *   );
 * }
 * ```
 *
 * @see KeyboardProvider - The provider that enables the keyboard.
 * @see useKeyboard - Hook for accessing the keyboard context.
 */
export function useKeyboardField(
  id: string,
  ref?: RefObject<KeyboardElement | null>,
  enabled: boolean = false,
  options?: KeyboardOpenOptions,
) {
  const keyboard = useContext(KeyboardContext);

  const handleFocus = useCallback(
    (e?: React.FocusEvent<KeyboardElement>) => {
      if (!enabled || !keyboard || keyboard.isDisabled) return;
      const element = e?.currentTarget ?? ref?.current;
      if (element) {
        keyboard.openKeyboard(id, element, options);
      }
    },
    [id, ref, enabled, keyboard, options],
  );

  const handleBlur = useCallback(() => {
    if (!enabled || !keyboard || keyboard.isDisabled) return;
    keyboard.requestClose(id);
  }, [id, enabled, keyboard]);

  return {
    handleFocus,
    handleBlur,
    hasProvider: Boolean(keyboard),
  };
}
