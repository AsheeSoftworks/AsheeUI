/**
 * Clipboard component for AsheeUI.
 *
 * This file provides the headless `Clipboard` primitive: it owns copying text
 * and the copied state, and hands both to a render function so a consumer keeps
 * full control of what is rendered. `CopyButton` is the styled control built on
 * it, and a consumer with its own control (an icon in a table row, a menu item)
 * uses this component instead.
 */

"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { resolveAnimate } from "../../utils/resolve-token";
import { FALLBACK_CLIPBOARD_CONFIG } from "./clipboard-config";

/**
 * What a clipboard consumer renders with.
 */
export interface ClipboardState {
  /**
   * Whether the text is on the clipboard.
   * It returns to false after the configured timeout.
   */
  copied: boolean;

  /**
   * Whether the last attempt failed.
   * A browser refuses clipboard access outside a user gesture or without
   * permission, which is a state a consumer usually wants to surface.
   */
  error: boolean;

  /**
   * Copy the component's value, or the given text.
   *
   * @param text - Text to copy instead of the component's value.
   * @returns Whether the copy succeeded.
   */
  copy: (text?: string) => Promise<boolean>;

  /** Clear the copied and error states without copying. */
  reset: () => void;
}

/**
 * Props for the Clipboard component.
 */
export interface ClipboardProps {
  /** Text copied when `copy` is called without an argument. */
  value?: string;

  /**
   * How long the copied state lasts, in milliseconds.
   * Defaults to `components.clipboard.timeout`, then to the framework fallback.
   */
  timeout?: number;

  /** Called after a successful copy. */
  onCopy?: (text: string) => void;

  /** Called after a failed copy. */
  onError?: (error: unknown) => void;

  /** Renders the control, using the clipboard state. */
  children: (state: ClipboardState) => ReactNode;
}

/**
 * Writes text to the clipboard, falling back to a temporary selection.
 *
 * The asynchronous Clipboard API is unavailable in a non-secure context and in
 * environments that have no clipboard at all, so the fallback keeps the
 * component useful there instead of failing silently.
 *
 * @param text - Text to write.
 * @returns Whether the write succeeded.
 */
async function writeToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  if (typeof document === "undefined") {
    return false;
  }

  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";

  const active = document.activeElement;
  document.body.appendChild(area);
  area.select();

  try {
    return document.execCommand("copy");
  } finally {
    area.remove();
    if (active instanceof HTMLElement) {
      active.focus();
    }
  }
}

/**
 * Copies text and reports the result through a render function.
 *
 * The copied state is a timer, not a change of value, so this component keeps
 * one and clears it on unmount. Copying is a user-triggered side effect, so the
 * component performs no clipboard work during render and renders identically on
 * the server and the client.
 *
 * @param props - The value, the timing and the render function.
 * @param props.value - Text copied by a bare `copy()` call.
 * @param props.timeout - How long the copied state lasts.
 * @param props.onCopy - Called after a successful copy.
 * @param props.onError - Called after a failed copy.
 * @param props.children - Renders the control.
 * @returns The rendered control.
 *
 * @example
 * ```tsx
 * <Clipboard value={invoice.id}>
 *   {({ copied, copy }) => (
 *     <button type="button" onClick={() => copy()}>
 *       {copied ? "Copied" : "Copy invoice number"}
 *     </button>
 *   )}
 * </Clipboard>
 * ```
 *
 * @see CopyButton - The framework's own copy control.
 */
export function Clipboard({
  value,
  timeout,
  onCopy,
  onError,
  children,
}: ClipboardProps) {
  const config = useAsheeConfig();
  const resolvedTimeout = resolveAnimate<number>(
    timeout,
    config.components?.clipboard?.timeout,
    FALLBACK_CLIPBOARD_CONFIG.timeout,
  );

  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setCopied(false);
    setError(false);
  }, [clearTimer]);

  const copy = useCallback(
    async (text?: string) => {
      const target = text ?? value ?? "";

      try {
        const succeeded = await writeToClipboard(target);

        if (!succeeded) {
          clearTimer();
          setError(true);
          setCopied(false);
          onError?.(new Error("Clipboard access was refused"));
          return false;
        }

        clearTimer();
        setError(false);
        setCopied(true);
        onCopy?.(target);

        timer.current = setTimeout(() => {
          setCopied(false);
          timer.current = null;
        }, resolvedTimeout);

        return true;
      } catch (cause) {
        clearTimer();
        setError(true);
        setCopied(false);
        onError?.(cause);
        return false;
      }
    },
    [clearTimer, onCopy, onError, resolvedTimeout, value],
  );

  return <>{children({ copied, error, copy, reset })}</>;
}
