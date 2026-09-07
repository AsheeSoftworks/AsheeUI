/**
 * Keyboard context for AsheeUI virtual keyboard.
 * This file provides the KeyboardContext and KeyboardProvider components
 * that manage the state and lifecycle of the on-screen virtual keyboard.
 * The context tracks which input is active, manages open/close state,
 * and provides methods for controlling the keyboard from input components.
 */
"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import {
  defaultKeyboardConfig,
  type KeyboardConfig,
  type KeyboardLayouts,
  type LayoutName,
} from "./keyboard-config";

/**
 * Type for keyboard input elements.
 * The keyboard can attach to input and textarea elements.
 */
export type KeyboardElement = HTMLInputElement | HTMLTextAreaElement;

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
   * Opens the keyboard for a specific input element.
   * @param id - The ID of the input element.
   * @param el - The input element reference.
   */
  openKeyboard: (id: string, el: KeyboardElement) => void;

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
}

/**
 * React context for the keyboard state.
 */
export const KeyboardContext = createContext<KeyboardContextType | null>(null);

/**
 * Props for the KeyboardProvider component.
 */
export interface KeyboardProviderProps extends KeyboardConfig {
  /**
   * Child components that will have access to the keyboard context.
   */
  children: ReactNode;

  /**
   * Default layout to show when the keyboard opens.
   * @default "default"
   */
  defaultLayout?: LayoutName;

  /**
   * CSS height class for the keyboard container.
   */
  heightClass?: string;
}

/**
 * Provider component for the virtual keyboard.
 *
 * KeyboardProvider wraps your application or a section of it to provide
 * keyboard context. It manages the open/close state, active input tracking,
 * and configuration merging. Input components using useKeyboardField or
 * the KeyboardContext will automatically trigger the keyboard on focus.
 *
 * @param props - KeyboardProvider configuration options.
 * @param props.children - Child components.
 * @param props.layouts - Available keyboard layouts.
 * @param props.display - Display mappings for special keys.
 * @param props.defaultLayout - Default layout name. Defaults to "default".
 * @param props.heightClass - CSS height class for the keyboard.
 * @param props.autoShiftBack - Auto switch back from shift. Defaults to true.
 * @param props.closeDelay - Close delay in milliseconds. Defaults to 120.
 * @param props.variant - Visual variant for keys.
 * @param props.color - Theme color for keys.
 * @param props.radius - Corner rounding for keys.
 *
 * @example
 * ```tsx
 * import { KeyboardProvider, OnScreenKeyboard, Input } from "asheeui";
 *
 * export function App() {
 *   return (
 *     <KeyboardProvider heightClass="h-56">
 *       <Input
 *         label="Search"
 *         enableVirtualKeyboard
 *       />
 *       <OnScreenKeyboard />
 *     </KeyboardProvider>
 *   );
 * }
 * ```
 *
 * @see useKeyboard - Hook for accessing the keyboard context.
 * @see OnScreenKeyboard - The keyboard UI component.
 */
export function KeyboardProvider({
  children,
  layouts,
  display,
  defaultLayout,
  heightClass,
  autoShiftBack,
  closeDelay = 120,
  variant,
  color,
  radius,
}: KeyboardProviderProps) {
  const globalConfig = useAsheeConfig();
  const themeKeyboardConfig = globalConfig?.components?.keyboard as
    | KeyboardConfig
    | undefined;

  const mergedConfig = useMemo<KeyboardConfig>(
    () => ({
      layouts:
        layouts ??
        themeKeyboardConfig?.layouts ??
        (defaultKeyboardConfig.layouts as KeyboardLayouts),
      display:
        display ??
        themeKeyboardConfig?.display ??
        defaultKeyboardConfig.display,
      defaultLayout:
        defaultLayout ??
        themeKeyboardConfig?.defaultLayout ??
        defaultKeyboardConfig.defaultLayout,
      heightClass: heightClass,
      autoShiftBack:
        autoShiftBack ??
        themeKeyboardConfig?.autoShiftBack ??
        defaultKeyboardConfig.autoShiftBack,
      variant: variant ?? themeKeyboardConfig?.variant,
      color: color ?? themeKeyboardConfig?.color,
      radius: radius ?? themeKeyboardConfig?.radius,
    }),
    [
      layouts,
      themeKeyboardConfig,
      display,
      defaultLayout,
      heightClass,
      autoShiftBack,
      variant,
      color,
      radius,
    ],
  );

  const [isOpen, setIsOpen] = useState(false);
  const [activeInputId, setActiveInputId] = useState<string | null>(null);
  const [activeElement, setActiveElement] = useState<KeyboardElement | null>(
    null,
  );

  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openKeyboard = useCallback((id: string, el: KeyboardElement) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveInputId(id);
    setActiveElement(el);
    setIsOpen(true);
  }, []);

  const requestClose = useCallback(
    (id: string) => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      closeTimeoutRef.current = setTimeout(() => {
        setActiveInputId((current) => {
          if (current === id) {
            setIsOpen(false);
            setActiveElement(null);
          }
          return current;
        });
        closeTimeoutRef.current = null;
      }, closeDelay);
    },
    [closeDelay],
  );

  const forceClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(false);
    setActiveElement(null);
    setActiveInputId(null);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      activeInputId,
      activeElement,
      config: mergedConfig,
      openKeyboard,
      requestClose,
      forceClose,
    }),
    [
      isOpen,
      activeInputId,
      activeElement,
      mergedConfig,
      openKeyboard,
      requestClose,
      forceClose,
    ],
  );

  return (
    <KeyboardContext.Provider value={value}>
      {children}
    </KeyboardContext.Provider>
  );
}

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
