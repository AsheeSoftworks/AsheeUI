/**
 * Hook for connecting form inputs to the virtual keyboard.
 * This file provides the useKeyboardField hook that attaches focus and
 * blur handlers to input elements, triggering the on-screen keyboard
 * when the input is focused and requesting close on blur.
 */
"use client";

import { type RefObject, useCallback, useContext } from "react";
import {
  isInsideKeyboard,
  KeyboardContext,
  type KeyboardElement,
  type KeyboardOpenOptions,
} from "./KeyboardContext";

/**
 * Hook that connects a form input to the virtual keyboard system.
 *
 * useKeyboardField returns focus and blur handlers that should be passed
 * to an input element. When the input is focused, the keyboard opens.
 * When blurred, the keyboard closes after a configurable delay — unless the
 * focus moved into the keyboard itself, which is how a keyboard-only reader
 * reaches the keys without dismissing it.
 *
 * @param id - The unique ID of the input element.
 * @param ref - Optional ref to the input element.
 * @param enabled - Whether the keyboard should be enabled for this field.
 *                  Defaults to false here; the field components pass `true`.
 * @param options - Optional configuration overrides for this field.
 * @returns An object containing handleFocus, handleBlur, and hasProvider.
 *
 * @example
 * ```tsx
 * import { useKeyboardField } from "@asheeui/web";
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

  const handleBlur = useCallback(
    (e?: React.FocusEvent<KeyboardElement>) => {
      if (!enabled || !keyboard || keyboard.isDisabled) return;

      // The keys are buttons in a portal, so focusing one blurs the field. That
      // is the reader moving *to* the keyboard, not leaving it: requesting a
      // close here dismissed the keyboard as soon as a keyboard-only reader
      // tabbed into it. A consumer that wires `onBlur={handleBlur}` passes the
      // event; the fallback covers the ones that call the handler without it.
      const nextFocus =
        e?.relatedTarget ??
        (typeof document === "undefined" ? null : document.activeElement);
      if (isInsideKeyboard(nextFocus)) return;

      keyboard.requestClose(id);
    },
    [id, enabled, keyboard],
  );

  return {
    handleFocus,
    handleBlur,
    hasProvider: Boolean(keyboard),
  };
}
