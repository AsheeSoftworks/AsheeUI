"use client";

import type { Radius } from "@ashee/theme";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAsheeConfig } from "../../../context";
import type { Color, Variant } from "../../../shared/variant";
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
  activeInput: string;
  inputs: Record<string, string>;
  config: KeyboardConfig;
  openKeyboard: (inputName: string) => void;
  requestClose: (inputName: string) => void;
  forceClose: () => void;
  setInput: (inputName: string, value: string) => void;
  getStringById: (id: string) => string;
  clearInputs: () => void;
  registerField: (name: string, el: KeyboardElement | null) => void;
  getField: (name: string) => KeyboardElement | null;
}

const KeyboardContext = createContext<KeyboardContextType | null>(null);

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
  radius?: keyof Radius;
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

  // Resolve configuration cascade: Explicit Props > Provider Config > Global Ashee Theme > Default Fallback
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
  const [activeInput, setActiveInput] = useState<string>("default");
  const [inputs, setInputsState] = useState<Record<string, string>>({});

  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const registryRef = useRef<Map<string, KeyboardElement>>(new Map());

  const registerField = useCallback(
    (name: string, el: KeyboardElement | null) => {
      if (el) {
        registryRef.current.set(name, el);
      } else {
        registryRef.current.delete(name);
      }
    },
    [],
  );

  const getField = useCallback((name: string) => {
    return registryRef.current.get(name) ?? null;
  }, []);

  const openKeyboard = useCallback((inputName: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveInput(inputName);
    setIsOpen(true);
  }, []);

  const requestClose = useCallback(
    (inputName: string) => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      closeTimeoutRef.current = setTimeout(() => {
        setActiveInput((current) => {
          if (current === inputName) {
            setIsOpen(false);
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
  }, []);

  const setInput = useCallback((id: string, value: string) => {
    setInputsState((prev) => ({ ...prev, [id]: value }));
  }, []);

  const getStringById = useCallback((id: string) => inputs[id] || "", [inputs]);

  const clearInputs = useCallback(() => {
    setInputsState({});
    setActiveInput("default");
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      activeInput,
      inputs,
      config: mergedConfig,
      openKeyboard,
      requestClose,
      forceClose,
      setInput,
      getStringById,
      clearInputs,
      registerField,
      getField,
    }),
    [
      isOpen,
      activeInput,
      inputs,
      mergedConfig,
      openKeyboard,
      requestClose,
      forceClose,
      setInput,
      getStringById,
      clearInputs,
      registerField,
      getField,
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
