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
import type { Radius } from "../../shared/radius";
import type { Color, Variant } from "../../shared/variant";
import { defaultKeyboardConfig } from "./default-keyboard-config";
import type {
  KeyboardConfig,
  KeyboardLayouts,
  KeyDisplayMap,
  LayoutName,
} from "./keyboard-config";

export type KeyboardElement = HTMLInputElement | HTMLTextAreaElement;

export interface KeyboardContextType {
  isOpen: boolean;
  activeInputId: string | null;
  activeElement: KeyboardElement | null;
  config: KeyboardConfig;
  openKeyboard: (id: string, el: KeyboardElement) => void;
  requestClose: (id: string) => void;
  forceClose: () => void;
}

export const KeyboardContext = createContext<KeyboardContextType | null>(null);

export interface KeyboardProviderProps {
  children: ReactNode;
  config?: KeyboardConfig;
  layouts?: KeyboardLayouts;
  display?: KeyDisplayMap;
  defaultLayout?: LayoutName;
  heightClass?: string;
  autoShiftBack?: boolean;
  closeDelay?: number;
  variant?: Variant;
  color?: Color;
  radius?: Radius;
}

export function KeyboardProvider({
  children,
  config: propConfig,
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
        propConfig?.layouts ??
        themeKeyboardConfig?.layouts ??
        (defaultKeyboardConfig.layouts as KeyboardLayouts),
      display:
        display ??
        propConfig?.display ??
        themeKeyboardConfig?.display ??
        defaultKeyboardConfig.display,
      defaultLayout:
        defaultLayout ??
        propConfig?.defaultLayout ??
        themeKeyboardConfig?.defaultLayout ??
        defaultKeyboardConfig.defaultLayout,
      heightClass:
        heightClass ??
        propConfig?.heightClass ??
        themeKeyboardConfig?.heightClass ??
        defaultKeyboardConfig.heightClass,
      autoShiftBack:
        autoShiftBack ??
        propConfig?.autoShiftBack ??
        themeKeyboardConfig?.autoShiftBack ??
        defaultKeyboardConfig.autoShiftBack,
      variant: variant ?? propConfig?.variant ?? themeKeyboardConfig?.variant,
      color: color ?? propConfig?.color ?? themeKeyboardConfig?.color,
      radius: radius ?? propConfig?.radius ?? themeKeyboardConfig?.radius,
    }),
    [
      layouts,
      propConfig,
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

export function useKeyboard() {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error("useKeyboard must be used within a <KeyboardProvider>");
  }
  return context;
}
