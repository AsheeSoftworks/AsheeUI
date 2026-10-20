/**
 * Keyboard context for AsheeUI virtual keyboard.
 * This file provides the KeyboardContext and useKeyboard hook
 * for controlling the on-screen virtual keyboard throughout the application.
 * Similar to the Toast system, the keyboard can be controlled via hooks
 * instead of requiring the component to be placed in the root.
 */
"use client";

import type { Color, Radius, Variant } from "@asheeui/core";
import { createContext, useContext } from "react";
import type {
  KeyboardConfig,
  KeyboardSizeKey,
  LayoutName,
} from "./keyboard-config";

/**
 * Type for keyboard input elements.
 * The keyboard can attach to input and textarea elements.
 */
export type KeyboardElement = HTMLInputElement | HTMLTextAreaElement;

/**
 * Options for opening the keyboard.
 */
export interface KeyboardOpenOptions {
  /**
   * The layout to show when the keyboard opens.
   * Overrides the provider's default layout.
   */
  layout?: LayoutName | undefined;

  /**
   * Size for this keyboard instance.
   * Overrides the provider's size setting.
   */
  size?: KeyboardSizeKey | undefined;

  /**
   * Variant for this keyboard instance.
   * Overrides the provider's variant setting.
   */
  variant?: Variant | undefined;

  /**
   * Color for this keyboard instance.
   * Overrides the provider's color setting.
   */
  color?: Color | undefined;

  /**
   * Radius for this keyboard instance.
   * Overrides the provider's radius setting.
   */
  radius?: Radius | undefined;

  /**
   * Portal setting for this keyboard instance.
   * Overrides the provider's portal setting.
   */
  portal?: boolean | undefined;
}

/**
 * Context type for the keyboard state and controls.
 */
export interface KeyboardContextType {
  /**
   * Whether the keyboard is currently open.
   */
  isOpen: boolean;

  /**
   * ID of the currently active input element.
   */
  activeInputId: string | null;

  /**
   * The currently active input element reference.
   */
  activeElement: KeyboardElement | null;

  /**
   * The merged keyboard configuration.
   */
  config: KeyboardConfig;

  /**
   * The resolved size for the keyboard.
   */
  resolvedSize: KeyboardSizeKey;

  /**
   * The resolved variant for the keyboard.
   */
  resolvedVariant: Variant;

  /**
   * The resolved color for the keyboard.
   */
  resolvedColor: Color;

  /**
   * The resolved radius for the keyboard.
   */
  resolvedRadius: Radius;

  /**
   * The resolved portal setting for the keyboard.
   */
  resolvedPortal: boolean;

  /**
   * Opens the keyboard for a specific input element.
   * @param id - The ID of the input element.
   * @param el - The input element reference.
   * @param options - Optional configuration overrides.
   */
  openKeyboard: (
    id: string,
    el: KeyboardElement,
    options?: KeyboardOpenOptions,
  ) => void;

  /**
   * Requests to close the keyboard for a specific input.
   * Uses a delay to prevent accidental closing on focus transitions.
   * @param id - The ID of the input element.
   */
  requestClose: (id: string) => void;

  /**
   * Immediately closes the keyboard regardless of state.
   */
  forceClose: () => void;

  /**
   * Sets the current layout of the keyboard.
   */
  setLayout: (layout: LayoutName) => void;

  /**
   * The current layout of the keyboard.
   */
  currentLayout: LayoutName;

  /**
   * Whether the keyboard system is globally disabled.
   */
  isDisabled: boolean;
}

/**
 * React context for the keyboard state.
 */
export const KeyboardContext = createContext<KeyboardContextType | null>(null);

// ─── Focus Helpers ─────────────────────────────────────────────────────────

/**
 * Attribute that marks the on-screen keyboard's container in the DOM.
 *
 * The keyboard is rendered in a portal, so it is not a descendant of the field
 * that opened it. The attribute is how the field's blur handler can tell that
 * the focus moved *into* the keyboard — to one of its keys — rather than away
 * from it.
 */
export const KEYBOARD_CONTAINER_ATTRIBUTE = "data-ashee-keyboard";

/**
 * Whether an element is the keyboard's container or sits inside it.
 *
 * @param target - The element receiving focus, when there is one.
 * @returns True when the focus stayed within the on-screen keyboard.
 */
export function isInsideKeyboard(target: EventTarget | null): boolean {
  return (
    typeof Element !== "undefined" &&
    target instanceof Element &&
    target.closest(`[${KEYBOARD_CONTAINER_ATTRIBUTE}]`) !== null
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────

/**
 * Hook for accessing the keyboard context.
 * Must be used within a KeyboardProvider.
 *
 * @returns The keyboard context value.
 * @throws {Error} When used outside of a KeyboardProvider.
 *
 * @example
 * ```tsx
 * const { isOpen, openKeyboard, forceClose } = useKeyboard();
 * ```
 */
export function useKeyboard() {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error("useKeyboard must be used within a <KeyboardProvider>");
  }
  return context;
}
