/**
 * On-screen virtual keyboard component for AsheeUI.
 * This file provides the OnScreenKeyboard component that renders a
 * floating keyboard UI with multiple layouts. It handles key presses,
 * layout switching, physical keyboard synchronization, and integration
 * with the keyboard context.
 */
"use client";

import { FloatingPortal } from "@floating-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Color, Radius, Variant } from "../../shared";
import { cn } from "../../utils";
import { Button } from "../button/Button";
import type { KeyboardElement } from "./KeyboardContext";
import type {
  KeyboardConfig,
  KeyboardSizeKey,
  LayoutName,
} from "./keyboard-config";
import {
  KEYBOARD_KEY_SIZE_CLASS,
  KEYBOARD_SIZE_CLASS,
} from "./keyboard-styles";

/**
 * Determines the flex width class for a key based on its token.
 * Special keys like space, backspace, enter, and shift get more space.
 */
function getKeyWidthClass(token: string) {
  if (token === "{space}") return "flex-[4]";
  if (
    ["{bksp}", "{enter}", "{shift}", "{symbols}", "{abc}", "{clear}"].includes(
      token,
    )
  ) {
    return "flex-[1.6]";
  }
  return "flex-1";
}

/**
 * Updates the value of an input element and dispatches a change event.
 * Used to programmatically modify the input value while maintaining
 * React's synthetic event system.
 */
function dispatchInputValueChange(
  el: KeyboardElement,
  newValue: string,
  cursorPos: number,
) {
  const prototype = Object.getPrototypeOf(el);
  const valueSetter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;

  if (valueSetter) {
    valueSetter.call(el, newValue);
  } else {
    el.value = newValue;
  }

  // Dispatch standard input event for React synthetic onChange handlers
  el.dispatchEvent(new Event("input", { bubbles: true }));

  requestAnimationFrame(() => {
    el.focus();
    el.setSelectionRange(cursorPos, cursorPos);
  });
}

/**
 * Performs a backspace operation at the cursor position.
 * Handles both selection deletion and single character deletion.
 */
function backspaceAtCursor(value: string, start: number, end: number) {
  if (start !== end)
    return { value: value.slice(0, start) + value.slice(end), cursor: start };
  if (start === 0) return { value, cursor: 0 };
  return {
    value: value.slice(0, start - 1) + value.slice(end),
    cursor: start - 1,
  };
}

/**
 * Inserts a character at the cursor position.
 */
function insertAtCursor(char: string) {
  return (value: string, start: number, end: number) => ({
    value: value.slice(0, start) + char + value.slice(end),
    cursor: start + char.length,
  });
}

/**
 * Props for the OnScreenKeyboard component.
 */
export interface OnScreenKeyboardProps {
  /**
   * Whether the keyboard is open.
   */
  isOpen: boolean;

  /**
   * The currently active input element.
   */
  activeElement: KeyboardElement | null;

  /**
   * The keyboard configuration.
   */
  config: KeyboardConfig;

  /**
   * The current layout name.
   */
  currentLayout: LayoutName;

  /**
   * Function to set the layout.
   */
  setLayout: (layout: LayoutName) => void;

  /**
   * Function to force close the keyboard.
   */
  forceClose: () => void;

  /**
   * Size scale for keyboard keys.
   */
  size: KeyboardSizeKey;

  /**
   * Visual variant for keys.
   */
  variant: Variant;

  /**
   * Theme color for keys.
   */
  color: Color;

  /**
   * Corner rounding for keys.
   */
  radius: Radius;

  /**
   * Whether to render the keyboard in a portal.
   */
  portal: boolean;

  /**
   * Extra CSS classes for the keyboard container.
   */
  className?: string;

  /**
   * Extra CSS classes for individual keys.
   */
  keyClassName?: string;

  /**
   * Whether the keyboard is globally disabled.
   */
  disabled?: boolean;
}

/**
 * The on-screen virtual keyboard UI.
 *
 * OnScreenKeyboard renders a floating keyboard that appears at the bottom
 * of the screen when an input is focused. It supports multiple layouts
 * (default, shift, symbols, numeric), key press handling with cursor
 * management, physical keyboard synchronization, and visual feedback
 * for pressed keys.
 *
 * The component is controlled by the KeyboardProvider and should not be
 * used directly. It automatically shows and hides based on the provider state.
 *
 * @param props - OnScreenKeyboard configuration options.
 * @param props.isOpen - Whether the keyboard is open.
 * @param props.activeElement - The active input element.
 * @param props.config - The keyboard configuration.
 * @param props.currentLayout - The current layout name.
 * @param props.setLayout - Function to set the layout.
 * @param props.forceClose - Function to force close the keyboard.
 * @param props.size - Size scale for keys.
 * @param props.variant - Visual variant for keys.
 * @param props.color - Theme color for keys.
 * @param props.radius - Corner rounding for keys.
 * @param props.portal - Whether to render in a portal.
 * @param props.className - Extra CSS classes.
 * @param props.keyClassName - Extra CSS classes for keys.
 * @param props.disabled - Whether the keyboard is disabled.
 *
 * @internal This component is used internally by KeyboardProvider.
 */
export function OnScreenKeyboard({
  isOpen,
  activeElement,
  config,
  currentLayout,
  setLayout,
  forceClose,
  size,
  variant,
  color,
  radius,
  portal,
  className,
  keyClassName,
  disabled = false,
}: OnScreenKeyboardProps) {
  const activeLayouts = config.layouts ?? {};
  const activeDisplay = config.display ?? {};
  const defaultLayoutName = config.defaultLayout ?? "default";
  const autoShiftBack = config.autoShiftBack ?? true;

  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [hoveredToken, setHoveredToken] = useState<string | null>(null);

  // Reset layout when keyboard opens
  useEffect(() => {
    if (isOpen) {
      setLayout(defaultLayoutName);
    }
  }, [isOpen, defaultLayoutName, setLayout]);

  const parsedRows = useMemo(() => {
    const rawRows =
      activeLayouts[currentLayout] || activeLayouts[defaultLayoutName] || [];

    return rawRows.map((rowStr, rIdx) => ({
      id: `${currentLayout}-row-${rIdx}`,
      keys: rowStr.split(" ").map((token, kIdx) => ({
        id: `${currentLayout}-r${rIdx}-k${kIdx}-${token}`,
        token,
      })),
    }));
  }, [activeLayouts, currentLayout, defaultLayoutName]);

  // Physical keyboard synchronization
  useEffect(() => {
    if (!isOpen || disabled) return;

    const currentLayoutRows = activeLayouts[currentLayout] || [];
    const flatKeys = currentLayoutRows.join(" ").split(" ");

    const physicalKeyToToken = (key: string): string | null => {
      if (key === "Backspace") return "{bksp}";
      if (key === "Enter") return "{enter}";
      if (key === " ") return "{space}";
      if (key === "Shift") return "{shift}";
      if (key.length === 1 && flatKeys.includes(key)) return key;
      return null;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        forceClose();
        return;
      }
      const token = physicalKeyToToken(e.key);
      if (token) setPressedKeys((prev) => new Set(prev).add(token));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const token = physicalKeyToToken(e.key);
      if (token) {
        setPressedKeys((prev) => {
          const next = new Set(prev);
          next.delete(token);
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isOpen, currentLayout, activeLayouts, forceClose, disabled]);

  const applyEdit = useCallback(
    (
      compute: (
        v: string,
        s: number,
        e: number,
      ) => { value: string; cursor: number },
    ) => {
      if (!activeElement) return;

      const current = activeElement.value;
      const start = activeElement.selectionStart ?? current.length;
      const end = activeElement.selectionEnd ?? current.length;

      const { value, cursor } = compute(current, start, end);
      dispatchInputValueChange(activeElement, value, cursor);
    },
    [activeElement],
  );

  const handleKeyPress = useCallback(
    (token: string) => {
      if (disabled) return;

      if (token === "{shift}") {
        // Toggle between shift and default using the currentLayout prop
        const newLayout =
          currentLayout === "shift"
            ? defaultLayoutName
            : currentLayout === defaultLayoutName
              ? "shift"
              : currentLayout;

        setLayout(newLayout);
        return;
      }
      if (token === "{symbols}") {
        setLayout("symbols");
        return;
      }
      if (token === "{abc}") {
        setLayout(defaultLayoutName);
        return;
      }
      if (token === "{clear}") {
        if (activeElement) dispatchInputValueChange(activeElement, "", 0);
        return;
      }
      if (token === "{enter}") {
        if (activeElement?.tagName === "TEXTAREA") {
          applyEdit(insertAtCursor("\n"));
        } else {
          activeElement?.blur();
        }
        return;
      }
      if (token === "{bksp}") {
        applyEdit(backspaceAtCursor);
        return;
      }

      const char = token === "{space}" ? " " : token;
      applyEdit(insertAtCursor(char));

      if (currentLayout === "shift" && autoShiftBack) {
        setLayout(defaultLayoutName);
      }
    },
    [
      activeElement,
      applyEdit,
      currentLayout,
      autoShiftBack,
      defaultLayoutName,
      disabled,
      setLayout,
    ],
  );

  if (!isOpen || disabled) return null;

  const resolvedHeightClass =
    KEYBOARD_SIZE_CLASS[size] || KEYBOARD_SIZE_CLASS.md;
  const keySizeClass =
    KEYBOARD_KEY_SIZE_CLASS[size] || KEYBOARD_KEY_SIZE_CLASS.md;

  const keyboardContent = (
    <section
      aria-label="Virtual Keyboard"
      className="fixed inset-x-0 bottom-0 z-9999 pointer-events-auto"
      onMouseDown={(e) => e.preventDefault()}>
      <div
        className={cn(
          "w-full bg-background border-t border-border shadow-2xl flex flex-col select-none",
          resolvedHeightClass,
          className,
        )}>
        <div className="flex flex-col gap-1.5 p-2 flex-1 min-h-0">
          {parsedRows.map((row) => (
            <div key={row.id} className="flex gap-1.5 flex-1">
              {row.keys.map(({ id, token }) => {
                const isPressed = pressedKeys.has(token);
                const isHovered = hoveredToken === token;
                const isKeyActive = isPressed || isHovered;
                const keyLabel = activeDisplay[token] ?? token;

                const currentKeyColor: Color = isKeyActive
                  ? color
                  : "secondary";

                return (
                  <Button
                    key={id}
                    variant={variant}
                    color={currentKeyColor}
                    radius={radius}
                    size={size}
                    onClick={() => handleKeyPress(token)}
                    onMouseEnter={() => setHoveredToken(token)}
                    onMouseLeave={() => setHoveredToken(null)}
                    className={cn(
                      "font-medium p-0 flex items-center justify-center",
                      keySizeClass,
                      getKeyWidthClass(token),
                      keyClassName,
                    )}>
                    {keyLabel}
                  </Button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return portal ? (
    <FloatingPortal>{keyboardContent}</FloatingPortal>
  ) : (
    keyboardContent
  );
}
