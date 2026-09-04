"use client";

import { cn } from "@asheeui/utils";
import { FloatingPortal } from "@floating-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAsheeConfig } from "../../libs/context";
import type { Radius } from "../../shared/radius";
import type { Color, Variant } from "../../shared/variant";
import { Button } from "../button/Button";
import type { LayoutName } from "./keyboard-config";
import { type KeyboardElement, useKeyboard } from "./keyboard-context";

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

function backspaceAtCursor(value: string, start: number, end: number) {
  if (start !== end)
    return { value: value.slice(0, start) + value.slice(end), cursor: start };
  if (start === 0) return { value, cursor: 0 };
  return {
    value: value.slice(0, start - 1) + value.slice(end),
    cursor: start - 1,
  };
}

function insertAtCursor(char: string) {
  return (value: string, start: number, end: number) => ({
    value: value.slice(0, start) + char + value.slice(end),
    cursor: start + char.length,
  });
}

export interface OnScreenKeyboardProps {
  className?: string;
  heightClass?: string;
  initialLayout?: LayoutName;
  variant?: Variant;
  color?: Color;
  radius?: Radius;
  keyClassName?: string;
}

export function OnScreenKeyboard({
  className,
  heightClass,
  initialLayout,
  variant: variantProp,
  color: colorProp,
  radius: radiusProp,
  keyClassName,
}: OnScreenKeyboardProps) {
  const keyboardContext = useKeyboard();
  if (!keyboardContext) return null;

  const { isOpen, activeElement, config, forceClose } = keyboardContext;
  const globalConfig = useAsheeConfig();

  const activeLayouts = config.layouts ?? {};
  const activeDisplay = config.display ?? {};
  const effectiveHeightClass = heightClass ?? config.heightClass;
  const defaultLayoutName = config.defaultLayout ?? "default";

  const resolvedVariant =
    variantProp ?? config.variant ?? globalConfig.defaultVariant ?? "solid";
  const resolvedColor =
    colorProp ?? config.color ?? globalConfig.defaultColor ?? "primary";
  const resolvedRadius = radiusProp ?? config.radius;

  const [layout, setLayout] = useState<LayoutName>(
    initialLayout ?? defaultLayoutName,
  );
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [hoveredToken, setHoveredToken] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLayout(initialLayout ?? defaultLayoutName);
    }
  }, [isOpen, initialLayout, defaultLayoutName]);

  const parsedRows = useMemo(() => {
    const rawRows =
      activeLayouts[layout] || activeLayouts[defaultLayoutName] || [];

    return rawRows.map((rowStr, rIdx) => ({
      id: `${layout}-row-${rIdx}`,
      keys: rowStr.split(" ").map((token, kIdx) => ({
        id: `${layout}-r${rIdx}-k${kIdx}-${token}`,
        token,
      })),
    }));
  }, [activeLayouts, layout, defaultLayoutName]);

  useEffect(() => {
    if (!isOpen) return;

    const currentLayoutRows = activeLayouts[layout] || [];
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
  }, [isOpen, layout, activeLayouts, forceClose]);

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
      if (token === "{shift}") {
        setLayout((l) =>
          l === "shift"
            ? defaultLayoutName
            : l === defaultLayoutName
              ? "shift"
              : l,
        );
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

      if (layout === "shift" && config.autoShiftBack) {
        setLayout(defaultLayoutName);
      }
    },
    [activeElement, applyEdit, layout, config.autoShiftBack, defaultLayoutName],
  );

  if (!isOpen) return null;

  return (
    <FloatingPortal>
      <section
        aria-label="Virtual Keyboard"
        className="fixed inset-x-0 bottom-0 z-9999 pointer-events-auto"
        onMouseDown={(e) => e.preventDefault()}>
        <div
          className={cn(
            "w-full bg-background border-t border-border shadow-2xl flex flex-col select-none",
            effectiveHeightClass,
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
                    ? resolvedColor
                    : "secondary";

                  return (
                    <Button
                      key={id}
                      variant={resolvedVariant}
                      color={currentKeyColor}
                      radius={resolvedRadius}
                      onClick={() => handleKeyPress(token)}
                      onMouseEnter={() => setHoveredToken(token)}
                      onMouseLeave={() => setHoveredToken(null)}
                      className={cn(
                        "h-full text-lg font-medium p-0 flex items-center justify-center",
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
    </FloatingPortal>
  );
}
