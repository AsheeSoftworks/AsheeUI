/**
 * Clipboard component for the native package.
 *
 * This file provides the headless `Clipboard` primitive: it owns copying text and the
 * copied state, and hands both to a render function so a consumer keeps full control of
 * what is rendered. `CopyButton` is the styled control built on it, and a consumer with its
 * own control (an icon in a row, a menu item) uses this component instead.
 *
 * The contract is the web's, and so is the reason for it: the copied state is a timer
 * rather than a change of value, so the component keeps one and clears it on unmount, and
 * copying is a user-triggered side effect, so nothing is written during a render. What
 * differs is what performs the write: the browser's clipboard on the web, and the
 * platform's own module here, through the package's `writeToClipboard` binding.
 */

import { resolveConfigCascade } from "@asheeui/core";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { writeToClipboard } from "../../utils/write-to-clipboard";
import {
  FALLBACK_NATIVE_CLIPBOARD_CONFIG,
  type NativeClipboardConfig,
} from "./clipboard-config";

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
   * The platform refuses a clipboard write outside a permitted context, which is a state a
   * consumer usually wants to surface.
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
 * Copies text and reports the result through a render function.
 *
 * The component renders no surface of its own: it is a render function with a state, which
 * is what lets one control live in a row, in a menu and in a dialog without the framework
 * guessing which a screen wanted. The state it hands over is the whole contract — whether
 * the text is on the clipboard, whether the last attempt failed, how to copy and how to
 * clear — so a consumer's own control is as complete as the framework's.
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
 *     <Button size="sm" onPress={() => void copy()}>
 *       {copied ? "Copied" : "Copy invoice number"}
 *     </Button>
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
  const config = useAsheeNativeConfig();

  const resolved = resolveConfigCascade<
    NativeClipboardConfig,
    Required<NativeClipboardConfig>
  >({ timeout }, config.components.clipboard, FALLBACK_NATIVE_CLIPBOARD_CONFIG);

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
        }, resolved.timeout);

        return true;
      } catch (cause) {
        clearTimer();
        setError(true);
        setCopied(false);
        onError?.(cause);
        return false;
      }
    },
    [clearTimer, onCopy, onError, resolved.timeout, value],
  );

  return <>{children({ copied, error, copy, reset })}</>;
}
