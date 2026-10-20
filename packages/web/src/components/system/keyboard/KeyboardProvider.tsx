/**
 * Keyboard provider component for AsheeUI.
 * This file provides the KeyboardProvider component that manages the
 * virtual keyboard state, lifecycle, and configuration. Similar to
 * ToastProvider, it controls when the keyboard is shown and provides
 * methods for opening and closing the keyboard via hooks.
 */
"use client";

import type { Color, Variant } from "@asheeui/core";
import { resolveCascade, resolveRadiusKey } from "@asheeui/core";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAsheeConfig } from "../../../libs/context";
import {
  isInsideKeyboard,
  KeyboardContext,
  type KeyboardContextType,
  type KeyboardElement,
  type KeyboardOpenOptions,
} from "./KeyboardContext";
import {
  defaultKeyboardConfig,
  FALLBACK_KEYBOARD_CONFIG,
  type KeyboardConfig,
  type KeyboardLayouts,
  type KeyboardSizeKey,
  type LayoutName,
} from "./keyboard-config";
import { OnScreenKeyboard } from "./OnScreenKeyboard";

// ─── Component Props ──────────────────────────────────────────────────────────

/**
 * Props for the KeyboardProvider component.
 */
export interface KeyboardProviderProps extends KeyboardConfig {
  /**
   * Child components that will have access to the keyboard context.
   */
  children: ReactNode;

  /**
   * Extra CSS classes for the keyboard container.
   */
  className?: string | undefined;

  /**
   * Extra CSS classes for individual keys.
   */
  keyClassName?: string | undefined;
}

// ─── Provider Component ───────────────────────────────────────────────────────

/**
 * Provider component for the virtual keyboard system.
 *
 * KeyboardProvider wraps your application or a section of it to provide
 * keyboard context. It manages the open/close state, active input tracking,
 * and configuration resolution. Input components using useKeyboardField or
 * the KeyboardContext will automatically trigger the keyboard on focus.
 *
 * The provider automatically renders the OnScreenKeyboard component at the
 * bottom of the DOM tree via React Portal. This ensures the keyboard appears
 * at the bottom of the screen regardless of where the input is in the DOM.
 *
 * @param props - KeyboardProvider configuration options.
 * @param props.children - Child components.
 * @param props.layouts - Available keyboard layouts.
 * @param props.display - Display mappings for special keys.
 * @param props.defaultLayout - Default layout name. Defaults to "default".
 * @param props.size - Size scale for keyboard keys. Defaults to "md".
 * @param props.autoShiftBack - Auto switch back from shift. Defaults to true.
 * @param props.closeDelay - Close delay in milliseconds. Defaults to 500.
 * @param props.variant - Visual variant for keys.
 * @param props.color - Theme color for keys.
 * @param props.radius - Corner rounding for keys.
 * @param props.portal - Whether to render the keyboard in a portal. Defaults to true.
 * @param props.disabled - Whether the keyboard system is disabled. Defaults to false.
 * @param props.className - Extra CSS classes for the keyboard container.
 * @param props.keyClassName - Extra CSS classes for individual keys.
 *
 * @example
 * ```tsx
 * import { KeyboardProvider, Input } from "@asheeui/web";
 *
 * export function App() {
 *   return (
 *     <KeyboardProvider size="lg">
 *       <Input label="Search" enableVirtualKeyboard />
 *     </KeyboardProvider>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Disable keyboard globally
 * <KeyboardProvider disabled>
 *   <Input label="Disabled field" />
 * </KeyboardProvider>
 * ```
 *
 * @see useKeyboard - Hook for accessing the keyboard context.
 * @see useKeyboardField - Hook for connecting inputs to the keyboard.
 */
export function KeyboardProvider({
  children,
  layouts,
  display,
  defaultLayout,
  size,
  autoShiftBack,
  closeDelay: closeDelayProp,
  variant,
  color,
  radius,
  portal: portalProp,
  disabled: disabledProp = false,
  className,
  keyClassName,
}: KeyboardProviderProps) {
  const globalConfig = useAsheeConfig();
  const themeKeyboardConfig = globalConfig?.components?.keyboard as
    | KeyboardConfig
    | undefined;

  // ─── Token Resolvers ──────────────────────────────────────────────────

  const resolvedSize = resolveCascade<KeyboardSizeKey>(
    size,
    themeKeyboardConfig?.size,
    undefined,
    FALLBACK_KEYBOARD_CONFIG.size,
  );

  const resolvedVariant = resolveCascade<Variant>(
    variant,
    themeKeyboardConfig?.variant,
    globalConfig.defaultVariant,
    FALLBACK_KEYBOARD_CONFIG.variant,
  );

  const resolvedColor = resolveCascade<Color>(
    color,
    themeKeyboardConfig?.color,
    globalConfig.defaultColor,
    FALLBACK_KEYBOARD_CONFIG.color,
  );

  const resolvedRadius = resolveRadiusKey(
    radius,
    themeKeyboardConfig?.radius,
    globalConfig.defaultRadius,
    FALLBACK_KEYBOARD_CONFIG.radius,
  );

  const resolvedPortal = resolveCascade<boolean>(
    portalProp,
    themeKeyboardConfig?.portal,
    undefined,
    FALLBACK_KEYBOARD_CONFIG.portal,
  );

  const resolvedDisabled = resolveCascade<boolean>(
    disabledProp,
    themeKeyboardConfig?.disabled,
    undefined,
    FALLBACK_KEYBOARD_CONFIG.disabled,
  );

  const resolvedDefaultLayout = resolveCascade<LayoutName>(
    defaultLayout,
    themeKeyboardConfig?.defaultLayout,
    undefined,
    FALLBACK_KEYBOARD_CONFIG.defaultLayout,
  );

  const resolvedAutoShiftBack = resolveCascade<boolean>(
    autoShiftBack,
    themeKeyboardConfig?.autoShiftBack,
    undefined,
    FALLBACK_KEYBOARD_CONFIG.autoShiftBack,
  );

  const resolvedCloseDelay = resolveCascade<number>(
    closeDelayProp,
    themeKeyboardConfig?.closeDelay,
    undefined,
    FALLBACK_KEYBOARD_CONFIG.closeDelay,
  );

  // ─── State ──────────────────────────────────────────────────────────────

  const [isOpen, setIsOpen] = useState(false);
  const [activeInputId, setActiveInputId] = useState<string | null>(null);
  const [activeElement, setActiveElement] = useState<KeyboardElement | null>(
    null,
  );
  const [currentLayout, setCurrentLayout] = useState<LayoutName>(
    resolvedDefaultLayout,
  );
  const [overrideOptions, setOverrideOptions] = useState<KeyboardOpenOptions>(
    {},
  );

  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * The active field's id, readable from a timeout whose closure predates the
   * latest render. The timeout has to compare the field it was scheduled for
   * with the field that is active *now*, or a close meant for the field being
   * left would close the keyboard another field just opened.
   */
  const activeInputIdRef = useRef<string | null>(null);

  const setActiveInput = useCallback((id: string | null) => {
    activeInputIdRef.current = id;
    setActiveInputId(id);
  }, []);

  /** Put the layout back to the provider's default while no field owns it. */
  const resetLayout = useCallback(() => {
    setCurrentLayout(resolvedDefaultLayout);
  }, [resolvedDefaultLayout]);

  // ─── Merged Config ──────────────────────────────────────────────────────

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
      defaultLayout: resolvedDefaultLayout,
      size: resolvedSize,
      autoShiftBack: resolvedAutoShiftBack,
      variant: resolvedVariant,
      color: resolvedColor,
      radius: resolvedRadius,
      portal: resolvedPortal,
      disabled: resolvedDisabled,
    }),
    [
      layouts,
      themeKeyboardConfig,
      display,
      resolvedDefaultLayout,
      resolvedSize,
      resolvedAutoShiftBack,
      resolvedVariant,
      resolvedColor,
      resolvedRadius,
      resolvedPortal,
      resolvedDisabled,
    ],
  );

  // ─── Handlers ──────────────────────────────────────────────────────────

  const openKeyboard = useCallback(
    (id: string, el: KeyboardElement, options?: KeyboardOpenOptions) => {
      if (resolvedDisabled) return;

      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }

      // The field whose keyboard is already open: focus came back to it before
      // the close delay elapsed, or a key press asked it to take focus back.
      // This is not a new open, so the layout the reader chose survives unless
      // the caller states one explicitly.
      if (isOpen && activeInputIdRef.current === id) {
        setActiveElement(el);
        if (options?.layout) setCurrentLayout(options.layout);
        return;
      }

      setActiveInput(id);
      setActiveElement(el);
      setOverrideOptions(options || {});

      // A field that stated a layout opens that layout; everything else opens
      // the provider's default. Nothing resets this after the open — the
      // reset happens on close — so a per-field choice survives.
      const layoutToUse = options?.layout ?? resolvedDefaultLayout;
      setCurrentLayout(layoutToUse);

      setIsOpen(true);
    },
    [resolvedDisabled, resolvedDefaultLayout, isOpen, setActiveInput],
  );

  const requestClose = useCallback(
    (id: string) => {
      if (resolvedDisabled) return;

      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      closeTimeoutRef.current = setTimeout(() => {
        closeTimeoutRef.current = null;

        // Focus moved into the keyboard itself — a keyboard-only reader tabbed
        // to a key — so this is not a close. Keeping the comparison inside the
        // timeout also covers handlers that were called without the event.
        if (
          typeof document !== "undefined" &&
          isInsideKeyboard(document.activeElement)
        ) {
          return;
        }

        if (activeInputIdRef.current !== id) return;

        setIsOpen(false);
        setActiveElement(null);
        setOverrideOptions({});
        resetLayout();
      }, resolvedCloseDelay);
    },
    [resolvedDisabled, resolvedCloseDelay, resetLayout],
  );

  const forceClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(false);
    setActiveElement(null);
    setActiveInput(null);
    setOverrideOptions({});
    resetLayout();
  }, [resetLayout, setActiveInput]);

  // `disabled` is not a pause: turning it on while the keyboard is open has to
  // forget the open state and the field it belonged to, or turning it back off
  // re-shows a keyboard nobody opened.
  useEffect(() => {
    if (resolvedDisabled) forceClose();
  }, [resolvedDisabled, forceClose]);

  const setLayout = useCallback((layout: LayoutName) => {
    setCurrentLayout(layout);
  }, []);

  // ─── Context Value ──────────────────────────────────────────────────────

  const contextValue = useMemo<KeyboardContextType>(
    () => ({
      isOpen,
      activeInputId,
      activeElement,
      config: mergedConfig,
      resolvedSize,
      resolvedVariant,
      resolvedColor,
      resolvedRadius,
      resolvedPortal,
      openKeyboard,
      requestClose,
      forceClose,
      setLayout,
      currentLayout,
      isDisabled: resolvedDisabled,
    }),
    [
      isOpen,
      activeInputId,
      activeElement,
      mergedConfig,
      resolvedSize,
      resolvedVariant,
      resolvedColor,
      resolvedRadius,
      resolvedPortal,
      openKeyboard,
      requestClose,
      forceClose,
      setLayout,
      currentLayout,
      resolvedDisabled,
    ],
  );

  // ─── Render ─────────────────────────────────────────────────────────────

  // Determine which props to pass to the keyboard
  const keyboardSize = overrideOptions.size ?? resolvedSize;
  const keyboardVariant = overrideOptions.variant ?? resolvedVariant;
  const keyboardColor = overrideOptions.color ?? resolvedColor;
  const keyboardRadius = overrideOptions.radius ?? resolvedRadius;
  const keyboardPortal = overrideOptions.portal ?? resolvedPortal;

  return (
    <KeyboardContext.Provider value={contextValue}>
      {children}
      <OnScreenKeyboard
        isOpen={isOpen}
        activeElement={activeElement}
        config={mergedConfig}
        currentLayout={currentLayout}
        setLayout={setLayout}
        forceClose={forceClose}
        size={keyboardSize}
        variant={keyboardVariant}
        color={keyboardColor}
        radius={keyboardRadius}
        portal={keyboardPortal}
        className={className}
        keyClassName={keyClassName}
        disabled={resolvedDisabled}
      />
    </KeyboardContext.Provider>
  );
}
