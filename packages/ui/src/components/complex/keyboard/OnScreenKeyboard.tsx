"use client";

import type { Radius } from "@ashee/theme";
import { cn } from "@ashee/utils";
import { FloatingPortal } from "@floating-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAsheeConfig } from "../../../context";
import type { Color, Variant } from "../../../shared/variant";
import { Button } from "../../primitive/button/Button";
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

function withCursorEdit(
  el: KeyboardElement | null,
  current: string,
  compute: (
    value: string,
    start: number,
    end: number,
  ) => { value: string; cursor: number },
) {
  const start = el?.selectionStart ?? current.length;
  const end = el?.selectionEnd ?? current.length;
  return compute(current, start, end);
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
  radius?: keyof Radius;
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
  const {
    isOpen,
    activeInput,
    inputs,
    config,
    setInput,
    forceClose,
    getField,
  } = useKeyboard();
  const globalConfig = useAsheeConfig();
  const activeLayouts = config.layouts ?? {};
  const activeDisplay = config.display ?? {};
  const effectiveHeightClass = heightClass ?? config.heightClass;
  const defaultLayoutName = config.defaultLayout ?? "default";

  // Configuration token resolutions
  const resolvedVariant =
    variantProp ??
    config.variant ??
    globalConfig.theme.defaultVariant ??
    "solid";
  const resolvedColor =
    colorProp ?? config.color ?? globalConfig.theme.defaultColor ?? "primary";
  const resolvedRadius = radiusProp ?? config.radius;

  const [layout, setLayout] = useState<LayoutName>(
    initialLayout ?? defaultLayoutName,
  );
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [hoveredToken, setHoveredToken] = useState<string | null>(null);

  // Reset layout when opening
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

  // Physical keyboard visual highlight listener
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
      const el = getField(activeInput);
      const current = inputs[activeInput] ?? "";
      const { value, cursor } = withCursorEdit(el, current, compute);

      setInput(activeInput, value);

      requestAnimationFrame(() => {
        el?.setSelectionRange(cursor, cursor);
      });
    },
    [activeInput, inputs, getField, setInput],
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
        setInput(activeInput, "");
        return;
      }
      if (token === "{enter}") {
        const el = getField(activeInput);
        if (el?.tagName === "TEXTAREA") {
          applyEdit(insertAtCursor("\n"));
        } else {
          el?.blur();
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
    [
      activeInput,
      applyEdit,
      getField,
      layout,
      setInput,
      config.autoShiftBack,
      defaultLayoutName,
    ],
  );

  return (
    <FloatingPortal>
      <AnimatePresence>
        {isOpen && (
          <section
            aria-label="Virtual Keyboard"
            className="fixed inset-x-0 bottom-0 z-9999 pointer-events-auto"
            onMouseDown={(e) => e.preventDefault()}>
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
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

                      // Use "secondary" for resting state, resolved color when hovered or pressed
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
            </motion.div>
          </section>
        )}
      </AnimatePresence>
    </FloatingPortal>
  );
}
